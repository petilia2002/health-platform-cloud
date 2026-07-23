import axios from "axios";
import ApiError from "../exceptions/ApiError";
import AuthError from "../exceptions/AuthError";
import { store } from "../store/index";
import { logout } from "../store/authSlice";

export const AUTH_URL = "https://backend-petrenckovilya.amvera.io/auth";
export const API_URL = "https://backend-petrenckovilya.amvera.io/api";

export const httpClient = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = { ...error.config };
    originalRequest._isRetry = true;
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry &&
      !error.config.url.includes("/auth/refresh")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const result = await axios.get(`${AUTH_URL}/refresh`, {
            withCredentials: true,
          });
          const { access_token } = result.data;
          localStorage.setItem("token", access_token);

          processQueue(null, access_token);
          isRefreshing = false;

          return httpClient.request(originalRequest);
        } catch (e) {
          processQueue(e, null);
          isRefreshing = false;

          store.dispatch(logout());
          const message = e?.response?.data?.message;
          return Promise.reject(new AuthError(message, e?.response?.status));
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(httpClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }
    }
    return Promise.reject(
      new ApiError(error?.response?.data?.message, error?.response?.status),
    );
  },
);
