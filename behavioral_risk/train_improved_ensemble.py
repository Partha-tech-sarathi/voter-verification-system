import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    matthews_corrcoef,
    confusion_matrix,
    roc_auc_score
)

from xgboost import XGBClassifier
from catboost import CatBoostClassifier


# ================================
# 1. LOAD DATA
# ================================

df = pd.read_csv(
    "behavioral_risk/rba_preprocessed.csv"
)

y = df["Is Account Takeover"].astype(int)
X = df.drop(columns=["Is Account Takeover"])


# ================================
# 2. TRAIN / VALIDATION / TEST
# ================================

X_train_val, X_test, y_train_val, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

X_train, X_val, y_train, y_val = train_test_split(
    X_train_val,
    y_train_val,
    test_size=0.20,
    random_state=42,
    stratify=y_train_val
)

print("Training samples  :", len(X_train))
print("Validation samples:", len(X_val))
print("Testing samples   :", len(X_test))


# ================================
# 3. PREPROCESSING
# ================================

categorical_columns = [
    "Country",
    "Region",
    "City",
    "Browser Name and Version",
    "OS Name and Version",
    "Device Type"
]

numerical_columns = [
    "ASN",
    "Login Hour",
    "Login Day",
    "Login Is Weekend",
    "Login Successful",
    "Is Attack IP"
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_columns
        ),
        (
            "num",
            StandardScaler(),
            numerical_columns
        )
    ]
)

print("\nPreprocessing...")

X_train_p = preprocessor.fit_transform(X_train)
X_val_p = preprocessor.transform(X_val)
X_test_p = preprocessor.transform(X_test)

print("Preprocessing completed.")


# ================================
# 4. GRADIENT BOOSTING
# ================================

print("\nTraining Gradient Boosting...")

gb = GradientBoostingClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=3,
    random_state=42
)

gb.fit(X_train_p, y_train)

gb_val = gb.predict_proba(X_val_p)[:, 1]
gb_test = gb.predict_proba(X_test_p)[:, 1]

print("Gradient Boosting completed.")


# ================================
# 5. XGBOOST
# ================================

print("\nTraining XGBoost...")

xgb = XGBClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=6,
    eval_metric="logloss",
    tree_method="hist",
    random_state=42
)

xgb.fit(X_train_p, y_train)

xgb_val = xgb.predict_proba(X_val_p)[:, 1]
xgb_test = xgb.predict_proba(X_test_p)[:, 1]

print("XGBoost completed.")


# ================================
# 6. CATBOOST GPU
# ================================

print("\nTraining CatBoost GPU...")

cat = CatBoostClassifier(
    iterations=100,
    learning_rate=0.1,
    depth=6,
    task_type="GPU",
    devices="0",
    verbose=False,
    random_seed=42
)

cat.fit(X_train_p, y_train)

cat_val = cat.predict_proba(X_val_p)[:, 1]
cat_test = cat.predict_proba(X_test_p)[:, 1]

print("CatBoost completed.")


# ================================
# 7. SEARCH WEIGHTS + THRESHOLD
#    USING VALIDATION DATA ONLY
# ================================

print("\nSearching for best configuration...")

best_score = -1
best_weights = None
best_threshold = None

weight_values = [
    0.1, 0.2, 0.3, 0.4,
    0.5, 0.6, 0.7, 0.8
]

threshold_values = np.arange(
    0.20,
    0.71,
    0.02
)

for w_gb in weight_values:

    for w_cat in weight_values:

        w_xgb = 1.0 - w_gb - w_cat

        if w_xgb <= 0:
            continue

        val_probability = (
            w_gb * gb_val +
            w_cat * cat_val +
            w_xgb * xgb_val
        )

        for threshold in threshold_values:

            val_prediction = (
                val_probability >= threshold
            ).astype(int)

            score = matthews_corrcoef(
                y_val,
                val_prediction
            )

            if score > best_score:

                best_score = score

                best_weights = (
                    w_gb,
                    w_cat,
                    w_xgb
                )

                best_threshold = threshold


print("\nBEST VALIDATION CONFIGURATION")

print(
    "GB weight      :",
    round(best_weights[0], 2)
)

print(
    "CatBoost weight:",
    round(best_weights[1], 2)
)

print(
    "XGBoost weight :",
    round(best_weights[2], 2)
)

print(
    "Threshold      :",
    round(best_threshold, 2)
)

print(
    "Validation MCC :",
    round(best_score, 4)
)


# ================================
# 8. FINAL TEST
# ================================

test_probability = (
    best_weights[0] * gb_test +
    best_weights[1] * cat_test +
    best_weights[2] * xgb_test
)

test_prediction = (
    test_probability >= best_threshold
).astype(int)


# ================================
# 9. METRICS
# ================================

accuracy = accuracy_score(
    y_test,
    test_prediction
)

precision = precision_score(
    y_test,
    test_prediction,
    zero_division=0
)

recall = recall_score(
    y_test,
    test_prediction,
    zero_division=0
)

f1 = f1_score(
    y_test,
    test_prediction,
    zero_division=0
)

mcc = matthews_corrcoef(
    y_test,
    test_prediction
)

roc_auc = roc_auc_score(
    y_test,
    test_probability
)

tn, fp, fn, tp = confusion_matrix(
    y_test,
    test_prediction
).ravel()


# ================================
# 10. FINAL RESULTS
# ================================

print("\n================================")
print("EXPERIMENT C - IMPROVED ENSEMBLE")
print("Weighted GB + CatBoost + XGBoost")
print("================================")

print(
    "Accuracy :",
    round(accuracy * 100, 2),
    "%"
)

print(
    "Precision:",
    round(precision * 100, 2),
    "%"
)

print(
    "Recall   :",
    round(recall * 100, 2),
    "%"
)

print(
    "F1 Score :",
    round(f1 * 100, 2),
    "%"
)

print(
    "MCC      :",
    round(mcc, 4)
)

print(
    "ROC-AUC  :",
    round(roc_auc, 4)
)

print("\nCONFUSION MATRIX")

print("True Negative :", tn)
print("False Positive:", fp)
print("False Negative:", fn)
print("True Positive :", tp)