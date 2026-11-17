import cv2


def calculate_similarity(real_path, test_path):

    real_image = cv2.imread(
        real_path,
        cv2.IMREAD_GRAYSCALE
    )

    test_image = cv2.imread(
        test_path,
        cv2.IMREAD_GRAYSCALE
    )

    if real_image is None or test_image is None:
        return 0.0

    orb = cv2.ORB_create()

    keypoints1, descriptors1 = orb.detectAndCompute(
        real_image,
        None
    )

    keypoints2, descriptors2 = orb.detectAndCompute(
        test_image,
        None
    )

    if descriptors1 is None or descriptors2 is None:
        return 0.0

    matcher = cv2.BFMatcher(
        cv2.NORM_HAMMING,
        crossCheck=True
    )

    matches = matcher.match(
        descriptors1,
        descriptors2
    )

    if len(matches) == 0:
        return 0.0

    good_matches = [
        match
        for match in matches
        if match.distance < 55
    ]

    similarity = (
        len(good_matches)
        / len(matches)
    ) * 100

    return round(similarity, 2)
def verify_fingerprint(real_path, test_path):

    threshold = 11

    similarity = calculate_similarity(
        real_path,
        test_path
    )

    if similarity >= threshold:
        decision = "MATCH"
        fingerprint_match = True
    else:
                decision = "NO MATCH"
                fingerprint_match = False

    return {
    "similarity_score": similarity,
    "threshold": threshold,
    "fingerprint_match": fingerprint_match,
    "decision": decision
    }
if __name__ == "__main__":
    result = verify_fingerprint(
        "fingerprint/dataset/Real/1__M_Left_index_finger.BMP",
        "fingerprint/dataset/Altered/Altered-Easy/1__M_Left_index_finger_CR.BMP"
    )

    print(result)
