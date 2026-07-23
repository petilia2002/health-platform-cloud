from typing import List

from app.ml.domain import predict_features
from app.ml.scale import transform_mlp_data, transform_ulm_data
from app.ml.models import create_mlp, create_ulm

THRESHOLDS = {
    "ferritin": 0.0905,
    "glu": 0.0397,
    "chol": 0.4668,
    "uric": 0.1612,
    "hba1c": 0.0397,
    "ldl": 0.4668,
}

TARGET_COLS = [
    "ferritin",
    "glu",
    "chol",
    "uric",
]

TARGET_FEATURES = [
    "ferritin",
    "hba1c",
    "ldl",
    "uric",
]


def run_mlp(data: List):
    sample, params = data[0]["sample"], data[0]["results"]

    x = transform_mlp_data(params)

    model = create_mlp(x.shape[1])

    model.load_weights(f"app/ml/weights/mlp_weights.h5")
    print("Веса успешно загружены")

    y_pred = model.predict(x)
    y_pred = y_pred.ravel()

    results = []
    for idx, feature in enumerate(TARGET_FEATURES):
        value = y_pred[idx]
        analyte = TARGET_FEATURES[idx]
        title = next((item for item in predict_features if analyte in item), None)
        threshold = THRESHOLDS[feature]

        results.append(
            {
                "title": title,
                "analyte": analyte,
                "conclusion": "negative" if value < threshold else "positive",
                "result": str(value),
            }
        )

    response = {"status": "ok", "data": [{"sample": sample, "results": results}]}
    return response


def run_ulm(data: List):
    sample, params = data[0]["sample"], data[0]["results"]

    x_comp, w_comp, data_mask, target_ids = transform_ulm_data(params, TARGET_COLS)

    print(f"x_comp = {x_comp}, w_comp = {w_comp}")
    print(f"data_mask = {data_mask}, target_ids = {target_ids}\n")

    model = create_ulm(
        "app/ml/weights/embeddings.npy", x_comp.shape[1], target_ids.shape[1]
    )

    model.load_weights(f"app/ml/weights/ulm_weights.h5")
    print("Веса успешно загружены")

    y_pred = model.predict([x_comp, w_comp, data_mask, target_ids])
    y_pred = y_pred.ravel()

    results = []
    for idx, feature in enumerate(TARGET_FEATURES):
        value = y_pred[idx]
        analyte = TARGET_FEATURES[idx]
        title = next((item for item in predict_features if analyte in item), None)
        threshold = THRESHOLDS[feature]

        results.append(
            {
                "title": title,
                "analyte": analyte,
                "conclusion": "negative" if value < threshold else "positive",
                "result": str(value),
            }
        )

    response = {"status": "ok", "data": [{"sample": sample, "results": results}]}
    return response
