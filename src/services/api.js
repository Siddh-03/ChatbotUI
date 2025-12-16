import axios from "axios";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", // Fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. The "Interceptor" - Automatically attaches your token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // We will save the token here on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Optional: Global Error Handler (e.g., auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
