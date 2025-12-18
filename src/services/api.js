import axios from "axios";

// 1. Create the Axios instance
const api = axios.create({
  // Point to the new proxy
  baseURL: "/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. The "Interceptor" - Automatically attaches your token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("agentVerseUser");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
