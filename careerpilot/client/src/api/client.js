import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  // TODO: Attach the stored token as the Authorization bearer header.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Log the user out when the API responds with 401.
    return Promise.reject(error);
  }
);
