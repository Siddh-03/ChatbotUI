// src/services/authService.js
import api, { setMemoryCredentials, clearMemoryCredentials } from "./api"; // Import the helper
import axios from "axios";

export const authService = {
  // --- AUTHENTICATION ---

  login: async (email, password) => {
    const payload = { email, password };
    const response = await api.post("/login", payload);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("agentVerseUser", JSON.stringify({ email }));

      // --- STORE IN MEMORY (Secure) ---
      setMemoryCredentials(email, password);
    }
    return response.data;
  },

  signup: async (userData) => {
    // ... (Your existing signup code keeps working) ...
    const params = new URLSearchParams();
    params.append("email", userData.email);
    params.append("name", userData.name);
    params.append("phone_number", userData.phone_number);
    params.append("password", userData.password);
    params.append("profession_id", userData.profession_id);

    const response = await api.post("/register", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Note: Signup usually doesn't auto-login immediately with password in this flow,
    // but if it does, you might want to call setMemoryCredentials here too.
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("agentVerseUser");
    localStorage.removeItem("isAuthenticated");

    // --- CLEAR MEMORY ---
    clearMemoryCredentials();

    window.location.href = "/login";
  },

  // ... (Keep the rest of your service methods: verifyEmail, forgotPassword, etc.) ...
  verifyEmailByEmail: async (email, code) =>
    api.post("/verifyEmail", { email, code: String(code) }),
  resendVerificationEmail: async (email) =>
    api.post("/sendVerificationEmail", { email }),
  forgotPassword: async (email) => api.post("/forgot-password", { email }),
  verifyOtp: async (email, otp) => api.post("/verify-otp", { email, otp }),
  resetPassword: async (email, otp, newPassword) =>
    api.post("/reset-password", { email, otp, new_password: newPassword }),
  changePassword: async (email, oldPassword, newPassword) =>
    api.post("/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    }),
  getUserProfile: async () => api.get("/me"),
  updateProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append("profile_photo", file);
    return api.put("/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteAccount: async () => api.delete("/delete-account"),
  fetchActiveApiKey: async () => {
    const response = await axios.get("/api/auth/active-api-key");
    return response.data;
  },
};
