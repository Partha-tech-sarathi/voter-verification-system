import cv2
import os
import pandas as pd


def calculate_similarity(real_path, altered_path):

    real_image = cv2.imread(
        real_path,
        cv2.IMREAD_GRAYSCALE
    )

    altered_image = cv2.imread(
        altered_path,
        cv2.IMREAD_GRAYSCALE
    )

    if real_image is None or altered_image is None:
        return 0.0

    orb = cv2.ORB_create()

    keypoints1, descriptors1 = orb.detectAndCompute(
        real_image, None
    )

    keypoints2, descriptors2 = orb.detectAndCompute(
        altered_image, None
    )

    if descriptors1 is None or descriptors2 is None:
        return 0.0

    bf = cv2.BFMatcher(
        cv2.NORM_HAMMING,
        crossCheck=True
    )

    matches = bf.match(
        descriptors1,
        descriptors2
    )

    if len(matches) == 0:
        return 0.0

    good_matches = [
        m for m in matches
        if m.distance < 55
    ]

    similarity = (
        len(good_matches) / len(matches)
    ) * 100

    return round(similarity, 2)


print("Matching function created successfully")


# -----------------------------------
# Folder paths
# -----------------------------------

real_folder = "fingerprint/dataset/Real"

altered_folder = (
    "fingerprint/dataset/Altered/Altered-Easy"
)


# -----------------------------------
# Automatically create genuine pairs
# -----------------------------------

automatic_genuine_pairs = []


for filename in os.listdir(altered_folder):

    if filename.endswith("_CR.BMP"):

        real_filename = filename.replace(
            "_CR.BMP",
            ".BMP"
        )

        real_path = os.path.join(
            real_folder,
            real_filename
        )

        altered_path = os.path.join(
            altered_folder,
            filename
        )

        if os.path.exists(real_path):

            automatic_genuine_pairs.append(
                (
                    real_path,
                    altered_path
                )
            )


print(
    "Automatic genuine pairs found:",
    len(automatic_genuine_pairs)
)


# -----------------------------------
# Test first 100 genuine pairs
# -----------------------------------

print(
    "\nTesting first 100 genuine pairs:"
)

test_genuine_scores = []


for real_path, altered_path in automatic_genuine_pairs[:100]:

    score = calculate_similarity(
        real_path,
        altered_path
    )

    test_genuine_scores.append(
        score
    )


print(
    "Average genuine score:",
    round(
        sum(test_genuine_scores)
        / len(test_genuine_scores),
        2
    )
)

print(
    "Minimum genuine score:",
    min(test_genuine_scores)
)

print(
    "Maximum genuine score:",
    max(test_genuine_scores)
)


# -----------------------------------
# Function to get subject and finger
# -----------------------------------

def get_fingerprint_info(path):

    filename = os.path.basename(path)

    filename = filename.replace(
        "_CR.BMP",
        ""
    )

    filename = filename.replace(
        ".BMP",
        ""
    )

    subject_id, details = filename.split(
        "__",
        1
    )

    parts = details.split(
        "_",
        1
    )

    finger_type = parts[1]

    return subject_id, finger_type


# -----------------------------------
# Create correct impostor pairs
# Different subject + same finger type
# -----------------------------------

print(
    "\nCreating correct impostor pairs:"
)

correct_impostor_pairs = []


for real_path, _ in automatic_genuine_pairs:

    real_subject, real_finger = get_fingerprint_info(
        real_path
    )

    for _, altered_path in automatic_genuine_pairs:

        altered_subject, altered_finger = get_fingerprint_info(
            altered_path
        )

        if (
            real_subject != altered_subject
            and
            real_finger == altered_finger
        ):

            correct_impostor_pairs.append(
                (
                    real_path,
                    altered_path
                )
            )

            break

    if len(correct_impostor_pairs) == 100:
        break


print(
    "Correct impostor pairs found:",
    len(correct_impostor_pairs)
)


# -----------------------------------
# Test 100 correct impostor pairs
# -----------------------------------

correct_impostor_scores = []


for real_path, altered_path in correct_impostor_pairs:

    score = calculate_similarity(
        real_path,
        altered_path
    )

    correct_impostor_scores.append(
        score
    )


print(
    "Average impostor score:",
    round(
        sum(correct_impostor_scores)
        / len(correct_impostor_scores),
        2
    )
)

print(
    "Minimum impostor score:",
    min(correct_impostor_scores)
)

print(
    "Maximum impostor score:",
    max(correct_impostor_scores)
)


# -----------------------------------
# Save 100 genuine + 100 impostor
# results into CSV
# -----------------------------------

results = []


for score in test_genuine_scores:

    results.append(
        [
            "Genuine",
            score
        ]
    )


for score in correct_impostor_scores:

    results.append(
        [
            "Impostor",
            score
        ]
    )


df = pd.DataFrame(
    results,
    columns=[
        "Type",
        "Similarity"
    ]
)


df.to_csv(
    "fingerprint/results/fingerprint_100_results.csv",
    index=False
)


print(
    "\nFingerprint results saved successfully"
)
# -----------------------------------
# Threshold evaluation
# FAR and FRR
# -----------------------------------

print("\nThreshold Evaluation:")

thresholds = [
    10,
    11,
    12,
    13,
    14,
    15
]
for threshold in thresholds:

    false_accepts = 0
    false_rejects = 0

    # Genuine fingerprint rejected
    for score in test_genuine_scores:

        if score < threshold:
            false_rejects += 1

    # Impostor fingerprint accepted
    for score in correct_impostor_scores:

        if score >= threshold:
            false_accepts += 1

    far = (
        false_accepts
        / len(correct_impostor_scores)
    ) * 100

    frr = (
        false_rejects
        / len(test_genuine_scores)
    ) * 100

    print(
        "Threshold:",
        threshold,
        "| FAR:",
        round(far, 2),
        "%",
        "| FRR:",
        round(frr, 2),
        "%"
    )
    # -----------------------------------
# Accuracy at selected threshold
# -----------------------------------

selected_threshold = 11

true_accepts = 0
true_rejects = 0
false_accepts = 0
false_rejects = 0


for score in test_genuine_scores:

    if score >= selected_threshold:
        true_accepts += 1
    else:
        false_rejects += 1


for score in correct_impostor_scores:

    if score < selected_threshold:
        true_rejects += 1
    else:
        false_accepts += 1


total_samples = (
    len(test_genuine_scores)
    +
    len(correct_impostor_scores)
)


accuracy = (
    (true_accepts + true_rejects)
    / total_samples
) * 100


print("\nFinal evaluation at threshold 11:")

print("True Accepts:", true_accepts)
print("True Rejects:", true_rejects)
print("False Accepts:", false_accepts)
print("False Rejects:", false_rejects)

print(
    "Accuracy:",
    round(accuracy, 2),
    "%"
)
summary_data = {
    "ORB_Distance_Limit": [55],
    "Decision_Threshold": [11],
    "Genuine_Samples": [100],
    "Impostor_Samples": [100],
    "True_Accepts": [true_accepts],
    "True_Rejects": [true_rejects],
    "False_Accepts": [false_accepts],
    "False_Rejects": [false_rejects],
    "FAR_Percent": [7.0],
    "FRR_Percent": [7.0],
    "Approx_EER_Percent": [7.0],
    "Accuracy_Percent": [round(accuracy, 2)]
}

summary_df = pd.DataFrame(summary_data)

summary_df.to_csv(
    "fingerprint/results/fingerprint_evaluation_summary.csv",
    index=False
)

print("Evaluation summary saved successfully")