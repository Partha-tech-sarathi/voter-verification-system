import cv2
import numpy as np

image = cv2.imread(
    "fingerprint/results/skeleton_test.bmp",
    cv2.IMREAD_GRAYSCALE
)

ridge = (image == 0).astype(np.uint8)

ridge_endings = []
bifurcations = []

rows, cols = ridge.shape

for y in range(1, rows - 1):
    for x in range(1, cols - 1):

        if ridge[y, x] == 1:

            p = [
                ridge[y - 1, x],
                ridge[y - 1, x + 1],
                ridge[y, x + 1],
                ridge[y + 1, x + 1],
                ridge[y + 1, x],
                ridge[y + 1, x - 1],
                ridge[y, x - 1],
                ridge[y - 1, x - 1]
            ]

            crossing_number = 0

            for i in range(8):
                crossing_number += abs(
                    int(p[i]) - int(p[(i + 1) % 8])
                )

            crossing_number = crossing_number // 2

            if crossing_number == 1:
                ridge_endings.append((x, y))

            elif crossing_number == 3:
                bifurcations.append((x, y))

print("Ridge endings detected:", len(ridge_endings))
print("Bifurcations detected:", len(bifurcations))
margin = 10

filtered_endings = []
filtered_bifurcations = []

for x, y in ridge_endings:
    if margin < x < cols - margin and margin < y < rows - margin:
        filtered_endings.append((x, y))

for x, y in bifurcations:
    if margin < x < cols - margin and margin < y < rows - margin:
        filtered_bifurcations.append((x, y))

print("Filtered ridge endings:", len(filtered_endings))
print("Filtered bifurcations:", len(filtered_bifurcations))
def remove_close_points(points, min_distance=5):
    filtered = []

    for point in points:
        x1, y1 = point

        keep = True

        for x2, y2 in filtered:
            distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

            if distance < min_distance:
                keep = False
                break

        if keep:
            filtered.append(point)

    return filtered


final_endings = remove_close_points(filtered_endings, 8)
final_bifurcations = remove_close_points(filtered_bifurcations, 8)

print("Final ridge endings:", len(final_endings))
print("Final bifurcations:", len(final_bifurcations))
output = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

for x, y in final_endings:
    cv2.circle(output, (x, y), 2, (0, 0, 255), -1)

for x, y in final_bifurcations:
    cv2.circle(output, (x, y), 2, (255, 0, 0), -1)

cv2.imwrite(
    "fingerprint/results/minutiae_test.bmp",
    output
)

print("Minutiae image saved successfully")