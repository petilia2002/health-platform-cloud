import { httpClient } from "../http/httpClient";
import { API_URL } from "../http/httpClient";

export default class RequestService {
  static async get_requests(status) {
    return httpClient.get(`${API_URL}/requests`, {
      params: {
        ...(status && { status }),
      },
    });
  }

  static async create_request(doctor_id) {
    return httpClient.post(`${API_URL}/requests`, { doctor_id });
  }
  static async update_request(request_id, status) {
    return httpClient.put(`${API_URL}/requests/${request_id}`, { status });
  }

  static async create_access(prediction_id, request_id) {
    return httpClient.post(`${API_URL}/requests/access`, {
      prediction_id,
      request_id,
    });
  }

  static async update_access(access_id, access_status) {
    return httpClient.patch(`${API_URL}/requests/access/${access_id}`, {
      access_status,
    });
  }
}
