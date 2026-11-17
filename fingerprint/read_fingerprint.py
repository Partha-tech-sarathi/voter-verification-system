import cv2

image_path = "fingerprint/dataset/Real/1__M_Left_index_finger.BMP"

image = cv2.imread(image_path)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

print("Original image shape:", image.shape)
print("Grayscale image shape:", gray.shape)

cv2.imwrite("fingerprint/results/grayscale_test.bmp", gray)

print("Grayscale fingerprint saved successfully")
clahe = cv2.createCLAHE(
    clipLimit=2.0,
    tileGridSize=(8, 8)
)

enhanced = clahe.apply(gray)

cv2.imwrite(
    "fingerprint/results/enhanced_test.bmp",
    enhanced
)

print("Enhanced fingerprint saved successfully")
_, binary = cv2.threshold(
    enhanced,
    0,
    255,
    cv2.THRESH_BINARY + cv2.THRESH_OTSU
)

cv2.imwrite(
    "fingerprint/results/binary_test.bmp",
    binary
)

print("Binary fingerprint saved successfully")
from skimage.morphology import skeletonize
import numpy as np

# Convert black ridges to True
binary_ridges = binary == 0

# Thin ridges to 1-pixel width
skeleton = skeletonize(binary_ridges)

# Convert boolean image back to 0–255 format
skeleton_image = np.where(skeleton, 0, 255).astype(np.uint8)

cv2.imwrite(
    "fingerprint/results/skeleton_test.bmp",
    skeleton_image
)

print("Skeleton fingerprint saved successfully")