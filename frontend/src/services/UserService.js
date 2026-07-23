import { httpClient, API_URL, AUTH_URL } from "../http/httpClient";

export default class UserService {
  static async get_profile(user_id) {
    return httpClient.get(`${API_URL}/profile/${user_id}`);
  }

  static async update_profile(profile_data) {
    return httpClient.patch(`${API_URL}/profile`, profile_data);
  }

  static async get_users() {
    return httpClient.get(`${AUTH_URL}/users`);
  }

  static async get_user(user_id) {
    return httpClient.get(`${AUTH_URL}/users/${user_id}`);
  }

  static async get_me() {
    return httpClient.get(`${AUTH_URL}/me`);
  }

  static async get_doctors(query) {
    return httpClient.get(`${API_URL}/doctors`, {
      params: { ...(query && { query }) },
    });
  }

  static async get_patients() {
    return httpClient.get(`${API_URL}/patients`);
  }

  static async get_patient_by_id(patientId) {
    return httpClient.get(`${API_URL}/patients/${patientId}`);
  }

  static async get_admins() {
    return httpClient.get(`${API_URL}/admins`);
  }

  static async upload_photo(formData) {
    return httpClient.post(`${API_URL}/profile/photo`, formData);
  }

  static async update_photo(formData) {
    return httpClient.put(`${API_URL}/profile/photo`, formData);
  }

  static async delete_photo() {
    return httpClient.delete(`${API_URL}/profile/photo`);
  }
}
