
import secrets
import time

# Temporary in-memory OTP storage
otp_store = {}

OTP_EXPIRY_SECONDS = 300
MAX_OTP_ATTEMPTS = 5


def generate_otp(voter_id):
    otp = str(secrets.randbelow(900000) + 100000)

    otp_store[voter_id] = {
        "otp": otp,
        "created_at": time.time(),
        "attempts": 0,
    }

    return otp


def verify_otp(voter_id, entered_otp):
    stored_data = otp_store.get(voter_id)

    if stored_data is None:
        return False

    # Check OTP expiry (5 minutes)
    if time.time() - stored_data["created_at"] > OTP_EXPIRY_SECONDS:
        del otp_store[voter_id]
        return False

    # Check maximum attempts
    if stored_data["attempts"] >= MAX_OTP_ATTEMPTS:
        del otp_store[voter_id]
        return False

    # Verify OTP securely
    if secrets.compare_digest(
        str(entered_otp),
        stored_data["otp"]
    ):
        del otp_store[voter_id]
        return True

    stored_data["attempts"] += 1
    return False
