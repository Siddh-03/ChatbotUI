import api from "./api";

export const authService = {
  // ... existing login/signup methods ...
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "agentVerseUser",
        JSON.stringify(response.data.user)
      );
    }
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "agentVerseUser",
        JSON.stringify(response.data.user)
      );
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("agentVerseUser");
    window.location.href = "/login"; // Force redirect
  },

  // 1. Request OTP
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // 2. Verify OTP
  verifyOtp: async (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
  },

  // 3. Reset Password
  resetPassword: async (email, otp, newPassword) => {
    return api.post('/auth/reset-password', { email, otp, newPassword });
  },

  // --- NEW METHODS FOR SETTINGS ---

  // POST /auth/deactivate
  deactivateAccount: async () => {
    // We assume the backend handles the logic using the bearer token
    return api.post("/auth/deactivate");
  },

  // DELETE /auth/delete
  deleteAccount: async () => {
    return api.delete("/auth/delete");
  },

  // GET /auth/export-data
  exportData: async () => {
    return api.get("/auth/export-data", { responseType: "blob" }); // Expecting a file
  },
};
