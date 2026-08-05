import axios, { AxiosInstance } from "axios";
// import { API_URL } from "./config";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const url = `${API_URL}/api/v1/`
console.log("url: "+url)
export const apiClient: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("authorization");
    if (jwt) {
      config.headers.Authorization = `${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authorization");
      localStorage.removeItem("user");

      setTimeout(() => {
        alert("Session expired. Please login again.");
        window.location.href = "/";
      }, 0);
    }

    return Promise.reject(error);
  }
);