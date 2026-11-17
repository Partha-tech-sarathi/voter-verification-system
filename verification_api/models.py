from django.db import models


class Voter(models.Model):
    voter_id = models.CharField(primary_key=True, max_length=50)
    identity_reference = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    voter_status = models.CharField(max_length=50)
    biometric_reference = models.CharField(max_length=255)
    mobile_number = models.CharField(
    max_length=15,
    null=True,
    blank=True
    )
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "voters"

    def __str__(self):
        return self.voter_id


class Verification(models.Model):
    verification_id = models.CharField(
        primary_key=True,
        max_length=50
    )

    voter = models.ForeignKey(
        Voter,
        on_delete=models.DO_NOTHING,
        db_column="voter_id"
    )

    fingerprint_match = models.BooleanField()
    fingerprint_score = models.FloatField()

    behavioral_risk_score = models.FloatField(
        null=True,
        blank=True
    )

    calibrated_risk_score = models.FloatField(
        null=True,
        blank=True
    )

    confidence_score = models.FloatField(
        null=True,
        blank=True
    )

    uncertainty_score = models.FloatField(
        null=True,
        blank=True
    )

    authentication_method = models.CharField(
        max_length=100
    )

    final_decision = models.CharField(
        max_length=50
    )

    timestamp = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "verification"

    def __str__(self):
        return self.verification_id


class BlockchainAudit(models.Model):
    audit_id = models.CharField(
        primary_key=True,
        max_length=50
    )

    verification = models.ForeignKey(
        Verification,
        on_delete=models.DO_NOTHING,
        db_column="verification_id"
    )

    event_type = models.CharField(
        max_length=100
    )

    result = models.CharField(
        max_length=100
    )

    risk_score = models.FloatField(
        null=True,
        blank=True
    )

    timestamp = models.DateTimeField()

    previous_hash = models.TextField()
    current_hash = models.TextField()

    class Meta:
        managed = False
        db_table = "blockchain_audit"

    def __str__(self):
        return self.audit_id