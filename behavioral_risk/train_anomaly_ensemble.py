import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    matthews_corrcoef,
    roc_auc_score,
    confusion_matrix
)

from xgboost import XGBClassifier
from catboost import CatBoostClassifier


# ==========================================
# 1. LOAD DATA
# ==========================================

df = pd.read_csv(
    "behavioral_risk/rba_preprocessed.csv"
)

y = df["Is Account Takeover"].astype(int)
X = df.drop(columns=["Is Account Takeover"])


# ==========================================
# 2. TRAIN / VALIDATION / TEST
# ==========================================

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

print("Training   :", len(X_train))
print("Validation :", len(X_val))
print("Testing    :", len(X_test))


# ==========================================
# 3. PREPROCESSING
# ==========================================

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


# ==========================================
# 4. CATBOOST - SUPERVISED BRANCH
# ==========================================

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


# ==========================================
# 5. XGBOOST - SUPERVISED BRANCH
# ==========================================

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


# ==========================================
# 6. ISOLATION FOREST
# ==========================================

print("\nTraining Isolation Forest...")

# Train anomaly detector only on genuine/normal
# training examples.
normal_train = X_train_p[
    y_train.to_numpy() == 0
]

iso = IsolationForest(
    n_estimators=200,
    contamination="auto",
    random_state=42,
    n_jobs=-1
)

iso.fit(normal_train)

# decision_function:
# larger = more normal
# smaller = more anomalous
#
# Negating it gives:
# larger = more suspicious/anomalous

iso_val_raw = -iso.decision_function(X_val_p)
iso_test_raw = -iso.decision_function(X_test_p)


# Normalize using TRAIN-derived score range only

iso_train_raw = -iso.decision_function(normal_train)

iso_min = iso_train_raw.min()
iso_max = iso_train_raw.max()

denominator = iso_max - iso_min

if denominator == 0:
    denominator = 1

iso_val = np.clip(
    (iso_val_raw - iso_min) / denominator,
    0,
    1
)

iso_test = np.clip(
    (iso_test_raw - iso_min) / denominator,
    0,
    1
)

print("Isolation Forest completed.")


# ==========================================
# 7. META FEATURES
# ==========================================

# Validation predictions become training
# examples for the meta-classifier.

meta_val = np.column_stack(
    (
        cat_val,
        xgb_val,
        iso_val
    )
)

meta_test = np.column_stack(
    (
        cat_test,
        xgb_test,
        iso_test
    )
)


# ==========================================
# 8. META CLASSIFIER
# ==========================================

print("\nTraining Meta Classifier...")

meta_model = LogisticRegression(
    class_weight="balanced",
    random_state=42,
    max_iter=1000
)

meta_model.fit(
    meta_val,
    y_val
)

final_probability = meta_model.predict_proba(
    meta_test
)[:, 1]

predictions = (
    final_probability >= 0.5
).astype(int)

print("Meta Classifier completed.")


# ==========================================
# 9. EVALUATION
# ==========================================

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
    final_probability
)

tn, fp, fn, tp = confusion_matrix(
    y_test,
    predictions
).ravel()


# ==========================================
# 10. RESULTS
# ==========================================

print("\n====================================")
print("ANOMALY-AWARE HYBRID ENSEMBLE")
print("CatBoost + XGBoost + IsolationForest")
print("Meta Model: Logistic Regression")
print("====================================")

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