from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from .fallback_service import generate_otp, verify_otp
from fingerprint.fingerprint_service import verify_fingerprint
from .ml_service import predict_behavioral_risk

import os
import uuid
import hashlib

from .models import Voter, Verification, BlockchainAudit
from .serializers import (
    VoterSerializer,
    VerificationSerializer,
    BlockchainAuditSerializer
)


# --------------------------------------------------
# API STATUS
# --------------------------------------------------

@api_view(["GET"])
def api_status(request):
    return Response({
        "status": "success",
        "message": "Voter Verification API is running"
    })


# --------------------------------------------------
# VOTERS
# --------------------------------------------------

@api_view(["GET"])
def voters_list(request):

    voters = Voter.objects.all()

    serializer = VoterSerializer(
        voters,
        many=True
    )

    return Response(serializer.data)


# --------------------------------------------------
# VERIFICATION HISTORY
# --------------------------------------------------

@api_view(["GET"])
def verification_list(request):

    records = Verification.objects.all().order_by(
        "-timestamp"
    )

    serializer = VerificationSerializer(
        records,
        many=True
    )

    return Response(serializer.data)


# --------------------------------------------------
# BLOCKCHAIN AUDIT HISTORY
# --------------------------------------------------

@api_view(["GET"])
def blockchain_list(request):

    records = BlockchainAudit.objects.all().order_by(
        "-timestamp"
    )

    serializer = BlockchainAuditSerializer(
        records,
        many=True
    )

    return Response(serializer.data)


# --------------------------------------------------
# VERIFY VOTER
# --------------------------------------------------

@api_view(["POST"])
def verify_voter(request):

    # ----------------------------------------------
    # INPUT
    # ----------------------------------------------

    voter_id = request.data.get("voter_id")

    real_fingerprint_path = request.data.get(
        "real_fingerprint_path"
    )

    test_fingerprint_path = request.data.get(
        "test_fingerprint_path"
    )

    behavioral_features = request.data.get(
        "behavioral_features"
    )

    # ----------------------------------------------
    # VALIDATE INPUT
    # ----------------------------------------------

    if (
        voter_id is None
        or real_fingerprint_path is None
        or test_fingerprint_path is None
        or behavioral_features is None
    ):
        return Response(
            {
                "error":
                "voter_id, fingerprint paths and behavioral_features are required"
            },
            status=400
        )

    if not isinstance(behavioral_features, dict):
        return Response(
            {
                "error":
                "behavioral_features must be an object"
            },
            status=400
        )

    # ----------------------------------------------
    # CHECK VOTER
    # ----------------------------------------------

    try:
        voter = Voter.objects.get(
            voter_id=voter_id
        )

    except Voter.DoesNotExist:
        return Response(
            {
                "error": "Voter not found"
            },
            status=404
        )

    # ----------------------------------------------
    # CHECK FINGERPRINT FILES
    # ----------------------------------------------

    if not os.path.isfile(real_fingerprint_path):
        return Response(
            {
                "error":
                "Registered fingerprint file not found"
            },
            status=400
        )

    if not os.path.isfile(test_fingerprint_path):
        return Response(
            {
                "error":
                "Test fingerprint file not found"
            },
            status=400
        )

    # ----------------------------------------------
    # AUTOMATIC FINGERPRINT MATCHING
    # ----------------------------------------------

    fingerprint_result = verify_fingerprint(
        real_fingerprint_path,
        test_fingerprint_path
    )

    fingerprint_match = fingerprint_result[
        "fingerprint_match"
    ]

    similarity_percentage = fingerprint_result[
        "similarity_score"
    ]

    fingerprint_score = (
        similarity_percentage / 100
    )

    # ----------------------------------------------
    # AUTOMATIC ML BEHAVIORAL RISK
    # ----------------------------------------------

    try:

        ml_result = predict_behavioral_risk(
            behavioral_features
        )

        behavioral_risk_score = float(
            ml_result["behavioral_risk_score"]
        )

        ml_threshold = float(
            ml_result["threshold"]
        )

        high_risk = bool(
            ml_result["high_risk"]
        )

    except ValueError as e:

        return Response(
            {
                "error": str(e)
            },
            status=400
        )

    except Exception as e:

        return Response(
            {
                "error":
                "Behavioral risk prediction failed",

                "details":
                str(e)
            },
            status=500
        )

    # ----------------------------------------------
    # ML RISK LEVEL
    # ----------------------------------------------

    if high_risk:
        risk_level = "HIGH"
    else:
        risk_level = "LOW"

    # ----------------------------------------------
    # DECISION ENGINE
    # ----------------------------------------------

    if (
        fingerprint_match is True
        and risk_level == "LOW"
    ):
        decision = "VERIFIED"

    elif fingerprint_match is False:
        decision = "FALLBACK_REQUIRED"

    else:
        decision = "MANUAL_REVIEW"

    # ----------------------------------------------
    # CONFIDENCE / UNCERTAINTY
    # ----------------------------------------------

    confidence_score = max(
        behavioral_risk_score,
        1 - behavioral_risk_score
    )

    uncertainty_score = (
        1 - confidence_score
    )

    # ----------------------------------------------
    # GENERATE VERIFICATION ID
    # ----------------------------------------------

    verification_id = (
        "VER_" +
        uuid.uuid4().hex[:8].upper()
    )

    current_time = timezone.now()

    # ----------------------------------------------
    # SAVE VERIFICATION
    # ----------------------------------------------

    verification = Verification.objects.create(

        verification_id=verification_id,

        voter=voter,

        fingerprint_match=fingerprint_match,

        fingerprint_score=fingerprint_score,

        behavioral_risk_score=
        behavioral_risk_score,

        calibrated_risk_score=None,

        confidence_score=confidence_score,

        uncertainty_score=uncertainty_score,

        authentication_method="FINGERPRINT",

        final_decision=decision,

        timestamp=current_time
    )

    # ----------------------------------------------
    # GET PREVIOUS BLOCKCHAIN HASH
    # ----------------------------------------------

    previous_block = (
        BlockchainAudit.objects
        .order_by("-timestamp")
        .first()
    )

    if previous_block:
        previous_hash = (
            previous_block.current_hash
        )
    else:
        previous_hash = "0"

    # ----------------------------------------------
    # GENERATE AUDIT ID
    # ----------------------------------------------

    audit_id = (
        "AUD_" +
        uuid.uuid4().hex[:8].upper()
    )

    # ----------------------------------------------
    # CREATE BLOCKCHAIN HASH
    # ----------------------------------------------

    hash_data = (
        audit_id
        + verification_id
        + "VERIFICATION_COMPLETED"
        + decision
        + str(behavioral_risk_score)
        + previous_hash
    )

    current_hash = hashlib.sha256(
        hash_data.encode("utf-8")
    ).hexdigest()

    # ----------------------------------------------
    # SAVE BLOCKCHAIN AUDIT
    # ----------------------------------------------

    BlockchainAudit.objects.create(

        audit_id=audit_id,

        verification=verification,

        event_type=
        "VERIFICATION_COMPLETED",

        result=decision,

        risk_score=
        behavioral_risk_score,

        timestamp=current_time,

        previous_hash=previous_hash,

        current_hash=current_hash
    )

    # ----------------------------------------------
    # FINAL RESPONSE
    # ----------------------------------------------

    return Response({

        "verification_id":
        verification_id,

        "audit_id":
        audit_id,

        "voter_id":
        voter.voter_id,

        "fingerprint": {

            "similarity_percentage":
            similarity_percentage,

            "threshold":
            fingerprint_result["threshold"],

            "fingerprint_match":
            fingerprint_match,

            "fingerprint_decision":
            fingerprint_result["decision"]
        },

        "fingerprint_score":
        round(fingerprint_score, 4),

        "behavioral_risk_score":
        behavioral_risk_score,

        "ml_risk": {

            "threshold":
            ml_threshold,

            "high_risk":
            high_risk,

            "target":
            ml_result["ml_target"]
        },

        "risk_level":
        risk_level,

        "confidence_score":
        round(confidence_score, 4),

        "uncertainty_score":
        round(uncertainty_score, 4),

        "final_decision":
        decision,

        "blockchain": {

            "previous_hash":
            previous_hash,

            "current_hash":
            current_hash
        },

        "message":
        "Fingerprint, ML risk prediction, decision and blockchain audit completed successfully"
    })


# --------------------------------------------------
# REQUEST FALLBACK OTP
# --------------------------------------------------

@api_view(["POST"])
def request_fallback_otp(request):

    verification_id = request.data.get(
        "verification_id"
    )

    identity_reference = request.data.get(
        "identity_reference"
    )

    if (
        verification_id is None
        or identity_reference is None
    ):
        return Response(
            {
                "error":
                "verification_id and identity_reference are required"
            },
            status=400
        )

    # Find original verification
    try:
        verification = Verification.objects.get(
            verification_id=verification_id
        )

    except Verification.DoesNotExist:
        return Response(
            {
                "error":
                "Verification record not found"
            },
            status=404
        )

    # Fallback only when required
    if (
        verification.final_decision
        != "FALLBACK_REQUIRED"
    ):
        return Response(
            {
                "error":
                "This verification does not require fallback authentication"
            },
            status=400
        )

    voter = verification.voter

    # Check synthetic/test identity reference
    if (
        voter.identity_reference
        != identity_reference
    ):
        return Response(
            {
                "status": "failed",
                "message":
                "Identity reference does not match"
            },
            status=400
        )

    # Generate simulated/test OTP
    otp = generate_otp(
        voter.voter_id
    )

    return Response({

        "status": "success",

        "verification_id":
        verification.verification_id,

        "voter_id":
        voter.voter_id,

        "authentication_method":
        "TEST_OTP",

        "test_otp":
        otp,

        "message":
        "Test OTP generated successfully"
    })


# --------------------------------------------------
# VERIFY FALLBACK OTP
# --------------------------------------------------

@api_view(["POST"])
def verify_fallback_otp(request):

    verification_id = request.data.get(
        "verification_id"
    )

    otp = request.data.get(
        "otp"
    )

    behavioral_features = request.data.get(
        "behavioral_features"
    )

    # ----------------------------------------------
    # CHECK REQUIRED FIELDS
    # ----------------------------------------------

    if (
        verification_id is None
        or otp is None
        or behavioral_features is None
    ):
        return Response(
            {
                "error":
                "verification_id, otp and behavioral_features are required"
            },
            status=400
        )

    if not isinstance(behavioral_features, dict):
        return Response(
            {
                "error":
                "behavioral_features must be an object"
            },
            status=400
        )

    # ----------------------------------------------
    # FIND ORIGINAL VERIFICATION
    # ----------------------------------------------

    try:
        verification = Verification.objects.get(
            verification_id=verification_id
        )

    except Verification.DoesNotExist:
        return Response(
            {
                "error":
                "Verification record not found"
            },
            status=404
        )

    if (
        verification.final_decision
        != "FALLBACK_REQUIRED"
    ):
        return Response(
            {
                "error":
                "This verification does not require fallback authentication"
            },
            status=400
        )

    voter = verification.voter

    # ----------------------------------------------
    # VERIFY TEST OTP
    # ----------------------------------------------

    otp_valid = verify_otp(
        voter.voter_id,
        otp
    )

    ml_result = None
    ml_threshold = 0.37
    high_risk = None

    # ----------------------------------------------
    # OTP FAILED
    # ----------------------------------------------

    if not otp_valid:

        decision = "MANUAL_REVIEW"

        behavioral_risk_score = (
            verification.behavioral_risk_score
        )

        verification.authentication_method = (
            "TEST_OTP"
        )

        verification.final_decision = decision

        verification.save()

    # ----------------------------------------------
    # OTP SUCCESS
    # ----------------------------------------------

    else:

        try:

            ml_result = predict_behavioral_risk(
                behavioral_features
            )

            behavioral_risk_score = float(
                ml_result[
                    "behavioral_risk_score"
                ]
            )

            ml_threshold = float(
                ml_result["threshold"]
            )

            high_risk = bool(
                ml_result["high_risk"]
            )

        except ValueError as e:

            return Response(
                {
                    "error": str(e)
                },
                status=400
            )

        except Exception as e:

            return Response(
                {
                    "error":
                    "Behavioral risk prediction failed",

                    "details":
                    str(e)
                },
                status=500
            )

        # Re-evaluate behavioral risk
        if high_risk:
            decision = "MANUAL_REVIEW"
        else:
            decision = "VERIFIED"

        verification.authentication_method = (
            "FINGERPRINT+TEST_OTP"
        )

        verification.final_decision = (
            decision
        )

        verification.behavioral_risk_score = (
            behavioral_risk_score
        )

        verification.confidence_score = max(
            behavioral_risk_score,
            1 - behavioral_risk_score
        )

        verification.uncertainty_score = (
            1 -
            verification.confidence_score
        )

        verification.save()

    # ----------------------------------------------
    # BLOCKCHAIN AUDIT
    # ----------------------------------------------

    previous_block = (
        BlockchainAudit.objects
        .order_by("-timestamp")
        .first()
    )

    if previous_block:
        previous_hash = (
            previous_block.current_hash
        )
    else:
        previous_hash = "0"

    audit_id = (
        "AUD_" +
        uuid.uuid4().hex[:8].upper()
    )

    current_time = timezone.now()

    hash_data = (
        audit_id
        + verification.verification_id
        + "FALLBACK_AUTHENTICATION_COMPLETED"
        + decision
        + str(behavioral_risk_score)
        + previous_hash
    )

    current_hash = hashlib.sha256(
        hash_data.encode("utf-8")
    ).hexdigest()

    BlockchainAudit.objects.create(

        audit_id=audit_id,

        verification=verification,

        event_type=
        "FALLBACK_AUTHENTICATION_COMPLETED",

        result=decision,

        risk_score=
        behavioral_risk_score,

        timestamp=current_time,

        previous_hash=previous_hash,

        current_hash=current_hash
    )

    # ----------------------------------------------
    # RESPONSE
    # ----------------------------------------------

    response_data = {

        "verification_id":
        verification.verification_id,

        "voter_id":
        voter.voter_id,

        "otp_verified":
        otp_valid,

        "authentication_method":
        verification.authentication_method,

        "behavioral_risk_score":
        behavioral_risk_score,

        "final_decision":
        decision,

        "audit_id":
        audit_id,

        "blockchain": {

            "previous_hash":
            previous_hash,

            "current_hash":
            current_hash
        },

        "message":
        "Fallback authentication completed and audit saved"
    }

    if ml_result is not None:

        response_data["ml_risk"] = {

            "threshold":
            ml_threshold,

            "high_risk":
            high_risk,

            "target":
            ml_result["ml_target"]
        }

    return Response(
        response_data
    )


# --------------------------------------------------
# DASHBOARD SUMMARY
# --------------------------------------------------

@api_view(["GET"])
def dashboard_summary(request):

    total_verifications = (
        Verification.objects.count()
    )

    verified = Verification.objects.filter(
        final_decision="VERIFIED"
    ).count()

    fallback_required = Verification.objects.filter(
        final_decision="FALLBACK_REQUIRED"
    ).count()

    manual_review = Verification.objects.filter(
        final_decision="MANUAL_REVIEW"
    ).count()

    # Final ML threshold = 0.37
    high_risk = Verification.objects.filter(
        behavioral_risk_score__gte=0.37
    ).count()

    total_voters = (
        Voter.objects.count()
    )

    total_audit_records = (
        BlockchainAudit.objects.count()
    )

    return Response({

        "total_voters":
        total_voters,

        "total_verifications":
        total_verifications,

        "verified":
        verified,

        "fallback_required":
        fallback_required,

        "manual_review":
        manual_review,

        "high_risk":
        high_risk,

        "ml_risk_threshold":
        0.37,

        "total_audit_records":
        total_audit_records
    })


# --------------------------------------------------
# VERIFICATION DETAIL
# --------------------------------------------------

@api_view(["GET"])
def verification_detail(
    request,
    verification_id
):

    try:

        verification = Verification.objects.get(
            verification_id=verification_id
        )

    except Verification.DoesNotExist:

        return Response(
            {
                "error":
                "Verification not found"
            },
            status=404
        )

    verification_data = (
        VerificationSerializer(
            verification
        ).data
    )

    audit_records = (
        BlockchainAudit.objects.filter(
            verification=verification
        ).order_by("timestamp")
    )

    audit_data = (
        BlockchainAuditSerializer(
            audit_records,
            many=True
        ).data
    )

    return Response({

        "verification":
        verification_data,

        "blockchain_audit":
        audit_data
    })


# --------------------------------------------------
# VALIDATE BLOCKCHAIN
# --------------------------------------------------

@api_view(["GET"])
def validate_blockchain(request):

    blocks = (
        BlockchainAudit.objects
        .order_by("timestamp")
    )

    if not blocks.exists():

        return Response({

            "valid": True,

            "message":
            "Blockchain is empty"
        })

    previous_block = None

    for block in blocks:

        if previous_block is None:

            if block.previous_hash != "0":

                return Response({

                    "valid": False,

                    "broken_at":
                    block.audit_id,

                    "message":
                    "Blockchain linkage is broken"
                })

        else:

            if (
                block.previous_hash
                != previous_block.current_hash
            ):

                return Response({

                    "valid": False,

                    "broken_at":
                    block.audit_id,

                    "message":
                    "Blockchain linkage is broken"
                })

        previous_block = block

    return Response({

        "valid": True,

        "total_blocks":
        blocks.count(),

        "message":
        "Blockchain hash-chain linkage is valid"
    })