from typing import Dict, List
import pickle
import numpy as np

from app.ml.domain import analytes, biomarkers


class FeatureScaler:
    def __init__(self, eps=0.01):
        self.eps = eps
        self.mins = {}
        self.maxs = {}

    def fit(self, X, feature_names):
        for i, name in enumerate(feature_names):
            valid_data = X[~np.isnan(X[:, i]), i]
            if len(valid_data) > 0:
                self.mins[name] = np.min(valid_data)
                self.maxs[name] = np.max(valid_data)
            else:
                self.mins[name] = 0
                self.maxs[name] = 1

    def transform(self, X, feature_names):
        X_scaled = X.copy()

        for i, name in enumerate(feature_names):
            if name in self.mins:
                min_val = self.mins[name]
                max_val = self.maxs[name]

                # Расширяем границы на eps%
                add = self.eps * (max_val - min_val)
                y_max = max_val + add
                y_min = min_val - add

                # Масштабируем только не-None значения
                mask = ~np.isnan(X_scaled[:, i])
                if np.any(mask):
                    if y_max == y_min:
                        X_scaled[mask, i] = 0.5  # если все значения одинаковы
                    else:
                        # Масштабирование в [0.1, 0.9]
                        X_scaled[mask, i] = 0.1 + 0.8 * (X_scaled[mask, i] - y_min) / (
                            y_max - y_min
                        )

        return X_scaled

    def save(self, filename):
        with open(filename, "wb") as f:
            pickle.dump({"mins": self.mins, "maxs": self.maxs, "eps": self.eps}, f)

    def load(self, filename):
        with open(filename, "rb") as f:
            data = pickle.load(f)
            self.mins = data["mins"]
            self.maxs = data["maxs"]
            self.eps = data["eps"]


def compact_rows_preserve_order(x, feature_ids):
    x_compacted = np.zeros_like(x)
    f_compacted = np.zeros_like(feature_ids)

    for i in range(x.shape[0]):
        non_zero_indices = np.where(x[i] != 0)[0]

        for j, idx in enumerate(non_zero_indices):
            x_compacted[i, j] = x[i, idx]
            f_compacted[i, j] = feature_ids[i, idx]

    return x_compacted, f_compacted


def transform_mlp_data(params: Dict[str, str]) -> np.ndarray:
    values = []
    for analyte in analytes:
        loinc_code = analyte["loinc_code"]
        if loinc_code in params:
            input_val = float(params[loinc_code])
            if loinc_code != "GENDER":
                input_val = np.log(input_val)
            values.append(input_val)
        else:
            values.append(np.nan)

    x = np.array(values).reshape(1, -1)

    scaler = FeatureScaler(eps=0.01)
    scaler.load("app/ml/weights/feature_scaler.pkl")

    feature_names = [analyte["name"] for analyte in analytes]
    x_scaled = scaler.transform(x, feature_names)

    x_scaled[np.isnan(x_scaled)] = 0.0
    return x_scaled


def transform_ulm_data(params: Dict[str, str], target_cols: List[str]) -> np.ndarray:
    values = []
    w_ids = []
    for analyte in analytes:
        loinc_code, id = analyte["loinc_code"], analyte["id"]
        if loinc_code in params:
            input_val = float(params[loinc_code])
            if loinc_code != "GENDER":
                input_val = np.log(input_val)
            values.append(input_val)
            w_ids.append(id)
        else:
            values.append(np.nan)
            w_ids.append(0)

    x = np.array(values).reshape(1, -1)
    w = np.array(w_ids).reshape(1, -1)

    scaler = FeatureScaler(eps=0.01)
    scaler.load("app/ml/weights/feature_scaler.pkl")

    feature_names = [analyte["name"] for analyte in analytes]
    x_scaled = scaler.transform(x, feature_names)

    x_scaled[np.isnan(x_scaled)] = 0.0

    x_comp, w_comp = compact_rows_preserve_order(x_scaled, w)
    data_mask = (w_comp > 0).astype(int)

    name_to_id = {item["name"]: item["id"] for item in biomarkers}
    target_ids = np.array([name_to_id[feature] for feature in target_cols])
    target_ids = target_ids.reshape(1, -1)

    return x_comp, w_comp, data_mask, target_ids
