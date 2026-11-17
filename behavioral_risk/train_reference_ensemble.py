import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    matthews_corrcoef,
    roc_auc_score,
    roc_curve
)

from xgboost import XGBClassifier


# ---------------------------------
# 1. LOAD DATA
# ---------------------------------

data_path = "behavioral_risk/rba_preprocessed.csv"

df = pd.read_csv(data_path)

y = df["Is Account Takeover"].astype(int)
X = df.drop(columns=["Is Account Takeover"])


# ---------------------------------
# 2. TRAIN / TEST SPLIT
# ---------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ---------------------------------
# 3. PREPROCESSING
# ---------------------------------

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

print("Preprocessing data...")

X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

print("Preprocessing completed.")


# ---------------------------------
# 4. GRADIENT BOOSTING
# ---------------------------------

print("\nTraining Gradient Boosting...")

gb_model = GradientBoostingClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=3,
    random_state=42
)

gb_model.fit(X_train_processed, y_train)

gb_prob = gb_model.predict_proba(
    X_test_processed
)[:, 1]

print("Gradient Boosting completed.")


# ---------------------------------
# 5. SVM
# ---------------------------------

print("\nTraining SVM...")

svm_model = SVC(
    kernel="rbf",
    C=1,
    probability=True,
    random_state=42
)

svm_model.fit(X_train_processed, y_train)

svm_prob = svm_model.predict_proba(
    X_test_processed
)[:, 1]

print("SVM completed.")


# ---------------------------------
# 6. XGBOOST
# ---------------------------------

print("\nTraining XGBoost...")

xgb_model = XGBClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=6,
    eval_metric="logloss",
    tree_method="hist",
    random_state=42
)

xgb_model.fit(X_train_processed, y_train)

xgb_prob = xgb_model.predict_proba(
    X_test_processed
)[:, 1]

print("XGBoost completed.")


# ---------------------------------
# 7. SOFT VOTING
# ---------------------------------

ensemble_probability = (
    gb_prob +
    svm_prob +
    xgb_prob
) / 3

predictions = (
    ensemble_probability >= 0.5
).astype(int)


# ---------------------------------
# 8. METRICS
# ---------------------------------

accuracy = accuracy_score(y_test, predictions)

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


# ---------------------------------
# 9. APPROXIMATE EER
# ---------------------------------

fpr, tpr, thresholds = roc_curve(
    y_test,
    ensemble_probability
)

fnr = 1 - tpr

eer_index = np.nanargmin(
    np.absolute(fnr - fpr)
)

eer = (
    fpr[eer_index] +
    fnr[eer_index]
) / 2


tn, fp, fn, tp = confusion_matrix(
    y_test,
    predictions
).ravel()


# ---------------------------------
# 10. RESULTS
# ---------------------------------

print("\n================================")
print("REFERENCE ENSEMBLE RESULTS")
print("GB + SVM + XGBoost")
print("================================")

print("Accuracy :", round(accuracy * 100, 2), "%")
print("Precision:", round(precision * 100, 2), "%")
print("Recall   :", round(recall * 100, 2), "%")
print("F1 Score :", round(f1 * 100, 2), "%")
print("MCC      :", round(mcc, 4))
print("ROC-AUC  :", round(roc_auc, 4))
print("EER      :", round(eer * 100, 2), "%")

print("\nCONFUSION MATRIX")
print("True Negative :", tn)
print("False Positive:", fp)
print("False Negative:", fn)
print("True Positive :", tp)