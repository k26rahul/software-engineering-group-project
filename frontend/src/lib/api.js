import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      if (error.response.data?.detail && typeof error.response.data.detail === "string") {
        message = error.response.data.detail;
      } else if (error.response.data?.message && typeof error.response.data.message === "string") {
        message = error.response.data.message;
      }
    } else if (error.request) {
      message = "Network error. Please check your connection and try again.";
    }

    const normalizedError = new Error(message);
    normalizedError.cause = error;
    normalizedError.status = error.response?.status;

    return Promise.reject(normalizedError);
  }
);

export default api;
