import cv2
real_image = cv2.imread(
    "fingerprint/dataset/Real/3__M_Left_index_finger.BMP",
    cv2.IMREAD_GRAYSCALE
)

altered_image = cv2.imread(
    "fingerprint/dataset/Altered/Altered-Easy/1__M_Left_index_finger_Zcut.BMP",
    cv2.IMREAD_GRAYSCALE
)
print("Real shape:", real_image.shape)
print("Altered shape:", altered_image.shape)
orb = cv2.ORB_create()

keypoints1, descriptors1 = orb.detectAndCompute(real_image, None)
keypoints2, descriptors2 = orb.detectAndCompute(altered_image, None)

print("Real keypoints:", len(keypoints1))
print("Altered keypoints:", len(keypoints2))
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

matches = bf.match(descriptors1, descriptors2)

matches = sorted(matches, key=lambda x: x.distance)

print("Total matches:", len(matches))

good_matches = [m for m in matches if m.distance < 50]

print("Good matches:", len(good_matches))
similarity_score = (len(good_matches) / len(matches)) * 100

print("Similarity score:", round(similarity_score, 2), "%")