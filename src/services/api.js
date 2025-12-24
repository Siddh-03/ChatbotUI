// src/services/api.js
import axios from "axios";

// --- IN-MEMORY CREDENTIALS STORE ---
let memoryCredentials = null;

export const setMemoryCredentials = (email, password) => {
  memoryCredentials = { email, password };
};

export const clearMemoryCredentials = () => {
  memoryCredentials = null;
};
// ------------------------------------------------------------

const api = axios.create({
  baseURL: "/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

// HELPER: Get clean token
const getCleanToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  return token
    .replace(/^"|"$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
};

api.interceptors.request.use(
  (config) => {
    const token = getCleanToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 Error
    if (error.response?.status === 401) {
      const rawError =
        error.response?.data?.error || error.response?.data?.message || "";
      const serverError = String(rawError).toLowerCase();

      // DEBUG LOG: See exactly what the backend is saying
      console.warn("API 401 Error:", serverError);

      // 1. CREDENTIAL CHECK: If it's a Wrong Password, STOP.
      // We check the error message OR if the URL is change-password/login
      if (
        serverError.includes("password") ||
        serverError.includes("credential")
      ) {
        return Promise.reject(error);
      }

      // 2. LOOP CHECK: If we already retried, STOP.
      // This prevents the logout loop. We just return the error to the UI.
      if (originalRequest._retry) {
        console.warn("Retry failed. Returning error to UI.");
        return Promise.reject(error);
      }

      // 3. AUTO-REFRESH LOGIC
      originalRequest._retry = true;

      if (memoryCredentials?.email && memoryCredentials?.password) {
        try {
          console.log("Attempting Auto-Refresh...");

          const loginResponse = await axios.post("/backend/login", {
            email: memoryCredentials.email,
            password: memoryCredentials.password,
          });

          const newToken = loginResponse.data.token;

          if (newToken) {
            console.log("Token refreshed. Retrying with NEW token...");

            // Save new token
            localStorage.setItem("authToken", newToken);

            // --- CRITICAL FIX: FORCE HEADERS UPDATE ---
            // Instead of modifying the object, we clone the headers
            // and explicitly set Authorization.
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };

            // Retry the request with the new config
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Auto-refresh failed:", refreshError);
        }
      }

      // 4. LOGOUT ONLY IF NECESSARY
      // If we are on the Change Password screen, DO NOT LOGOUT even if refresh fails.
      // Just let the user see "Invalid Token" so they can try again or manually logout.
      if (!window.location.pathname.includes("/login")) {
        // Optional: Only redirect if it's NOT a change-password request
        if (!originalRequest.url.includes("change-password")) {
          console.warn("Session fatal. Redirecting...");
          localStorage.removeItem("authToken");
          localStorage.removeItem("agentVerseUser");
          clearMemoryCredentials();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
