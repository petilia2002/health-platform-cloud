import axios from "axios";
import { httpClient, AUTH_URL } from "../http/httpClient";

export default class AuthService {
  static async registration(userData) {
    return httpClient.post(`${AUTH_URL}/registration`, userData);
  }
  static async login(userData) {
    return httpClient.post(`${AUTH_URL}/login`, userData);
  }
  static async logout() {
    return httpClient.post(`${AUTH_URL}/logout`);
  }
  static async refresh() {
    return axios.get(`${AUTH_URL}/refresh`, {
      withCredentials: true,
    });
  }
  static async confirm() {
    return httpClient.get(`${AUTH_URL}/confirm`);
  }
}
