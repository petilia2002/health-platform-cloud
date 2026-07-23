import { httpClient, API_URL } from "../http/httpClient";

export default class SampleService {
  static async get_samples(start_date, end_date) {
    return httpClient.get(`${API_URL}/samples`, {
      params: {
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      },
    });
  }

  static async get_sample_by_id(sample_id) {
    return httpClient.get(`${API_URL}/samples/${sample_id}`);
  }

  static async get_sample_by_patient(sample_id) {
    return httpClient.get(`${API_URL}/patients/samples/${sample_id}`);
  }

  static async create_sample(sample) {
    return httpClient.post(`${API_URL}/samples`, sample);
  }

  static async update_sample(sample_id, sample_data) {
    return httpClient.patch(`${API_URL}/samples/${sample_id}`, sample_data);
  }

  static async delete_sample(sample_id) {
    return httpClient.delete(`${API_URL}/samples/${sample_id}`);
  }
}
