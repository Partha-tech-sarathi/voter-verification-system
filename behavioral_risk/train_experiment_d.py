import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
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
# 2. SAME TRAIN / TEST SPLIT
# ================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


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
X_test_p = preprocessor.transform(X_test)

print("Preprocessing completed.")


# ================================
# 4. CLASS IMBALANCE RATIO
# ================================

negative_count = (y_train == 0).sum()
positive_count = (y_train == 1).sum()

class_ratio = negative_count / positive_count

print("\nNegative samples:", negative_count)
print("Positive samples:", positive_count)
print("Class ratio     :", round(class_ratio, 2))


# ================================
# 5. XGBOOST - IMBALANCE AWARE
# ================================

print("\nTraining imbalance-aware XGBoost...")

xgb = XGBClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=6,
    eval_metric="logloss",
    tree_method="hist",
    scale_pos_weight=class_ratio,
    random_state=42
)

xgb.fit(X_train_p, y_train)

xgb_prob = xgb.predict_proba(
    X_test_p
)[:, 1]

print("XGBoost completed.")


# ================================
# 6. CATBOOST - IMBALANCE AWARE
# ================================

print("\nTraining imbalance-aware CatBoost GPU...")

cat = CatBoostClassifier(
    iterations=100,
    learning_rate=0.1,
    depth=6,
    task_type="GPU",
    devices="0",
    class_weights=[1.0, class_ratio],
    verbose=False,
    random_seed=42
)

cat.fit(X_train_p, y_train)

cat_prob = cat.predict_proba(
    X_test_p
)[:, 1]

print("CatBoost completed.")


# ================================
# 7. SOFT VOTING
# ================================

ensemble_probability = (
    xgb_prob +
    cat_prob
) / 2

predictions = (
    ensemble_probability >= 0.5
).astype(int)


# ================================
# 8. METRICS
# ================================

accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)

mcc = matthews_corrcoef(
    y_test,
    predictions
)

roc_auc = roc_auc_score(
    y_test,
    ensemble_probability
)

tn, fp, fn, tp = confusion_matrix(
    y_test,
    predictions
).ravel()


# ================================
# 9. RESULTS
# ================================

print("\n================================")
print("EXPERIMENT D RESULTS")
print("Imbalance-Aware CatBoost + XGBoost")
print("================================")

print("Accuracy :", round(accuracy * 100, 2), "%")
print("Precision:", round(precision * 100, 2), "%")
print("Recall   :", round(recall * 100, 2), "%")
print("F1 Score :", round(f1 * 100, 2), "%")
print("MCC      :", round(mcc, 4))
print("ROC-AUC  :", round(roc_auc, 4))

print("\nCONFUSION MATRIX")
print("True Negative :", tn)
print("False Positive:", fp)
print("False Negative:", fn)
print("True Positive :", tp)