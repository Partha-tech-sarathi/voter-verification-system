from fingerprint_service import verify_fingerprint

result = verify_fingerprint(
    "fingerprint/dataset/Real/1__M_Left_index_finger.BMP",
    "fingerprint/dataset/Altered/Altered-Easy/1__M_Left_index_finger_CR.BMP"
)

print(result)