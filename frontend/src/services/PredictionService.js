import { httpClient, API_URL } from "../http/httpClient";

export default class PredictionService {
  static async get_predictions(start_date, end_date) {
    return httpClient.get(`${API_URL}/predictions`, {
      params: {
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      },
    });
  }

  static async get_predictions_by_patient(patient_id, start_date, end_date) {
    return httpClient.get(`${API_URL}/patients/${patient_id}/predictions`, {
      params: {
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      },
    });
  }

  static async get_prediction_by_id(prediction_id) {
    return httpClient.get(`${API_URL}/predictions/${prediction_id}`);
  }

  static async get_prediction_by_patient(patient_id, prediction_id) {
    return httpClient.get(
      `${API_URL}/patients/${patient_id}/predictions/${prediction_id}`
    );
  }

  static async create_prediction(sample_id) {
    return httpClient.post(`${API_URL}/predictions/${sample_id}`);
  }

  static async delete_prediction(prediction_id) {
    return httpClient.delete(`${API_URL}/predictions/${prediction_id}`);
  }

  static async comment_prediction(patient_id, prediction_id, doctor_comment) {
    return httpClient.patch(
      `${API_URL}/patients/${patient_id}/predictions/${prediction_id}`,
      {
        doctor_comment,
      }
    );
  }

  static async delete_comment(patient_id, prediction_id) {
    return httpClient.delete(
      `${API_URL}/patients/${patient_id}/predictions/${prediction_id}`
    );
  }
}
