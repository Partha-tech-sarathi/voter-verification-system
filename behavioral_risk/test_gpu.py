import numpy as np
from catboost import CatBoostClassifier

X = np.random.rand(10000, 20)
y = np.random.randint(0, 2, 10000)

print("Testing CatBoost GPU...")

model = CatBoostClassifier(
    iterations=20,
    task_type="GPU",
    devices="0",
    verbose=False,
    random_seed=42
)

model.fit(X, y)

print("CatBoost GPU test successful!")