import axios from "axios";

// The temporary Bearer token for API access
const API_BEARER_TOKEN =
  "cf3d9b9f6a96d267d0ff49dd623defb7db0e552fa9b4d02b172eea83ae251d62";

const api = axios.create({
  baseURL: "/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (API_BEARER_TOKEN) {
      config.headers.Authorization = `Bearer ${API_BEARER_TOKEN}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // --- DEBUGGING: Log the server's specific error message ---
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
    }
    // -----------------------------------------------------------

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("agentVerseUser");
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/signup")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
