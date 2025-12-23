import api from "./api";
import axios from "axios";

export const authService = {
  // --- AUTHENTICATION ---

  login: async (email, password) => {
    const payload = { email, password };
    // Proxies to /api/user/login
    const response = await api.post("/login", payload);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("agentVerseUser", JSON.stringify({ email }));
    }
    return response.data;
  },

  signup: async (userData) => {
    // Proxies to /api/user/register
    const params = new URLSearchParams();
    params.append("email", userData.email);
    params.append("name", userData.name);
    params.append("phone_number", userData.phone_number);
    params.append("password", userData.password);
    params.append("profession_id", userData.profession_id);

    const response = await api.post("/register", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data.status === "pending" || response.status === 201) {
      const backendUser = response.data.user;
      if (backendUser) {
        const userToSave = {
          ...backendUser,
          firstName: backendUser.name ? backendUser.name.split(" ")[0] : "",
          lastName: backendUser.name
            ? backendUser.name.split(" ").slice(1).join(" ")
            : "",
        };
        localStorage.setItem("agentVerseUser", JSON.stringify(userToSave));
      }
    }
    return response.data;
  },

  verifyEmailByEmail: async (email, code) => {
    // Proxies to /api/user/verifyEmail
    const payload = { email: email, code: String(code) };
    return api.post("/verifyEmail", payload);
  },

  resendVerificationEmail: async (email) => {
    // Proxies to /api/user/sendVerificationEmail
    return api.post("/sendVerificationEmail", { email });
  },

  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("agentVerseUser");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("tempSignupData");
    window.location.href = "/login";
  },

  // --- PASSWORD ---

  forgotPassword: async (email) => {
    return api.post("/forgot-password", { email });
  },

  verifyOtp: async (email, otp) => {
    return api.post("/verify-otp", { email, otp });
  },

  resetPassword: async (email, otp, newPassword) => {
    return api.post("/reset-password", {
      email,
      otp,
      new_password: newPassword,
    });
  },

  changePassword: async (email, oldPassword, newPassword) => {
    return api.post("/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // --- PROFILE ---

  getUserProfile: async () => {
    // Proxies to /api/user/me
    return api.get("/me");
  },

  updateProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append("profile_photo", file);
    return api.put("/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteAccount: async () => {
    // Proxies to /api/user/delete-account
    return api.delete("/delete-account");
  },

  // --- API KEYS ---

  fetchActiveApiKey: async () => {
    // Uses the generic /api proxy to reach /api/auth/active-api-key
    // We cannot use the 'api' instance here because it is base-mapped to /backend
    const response = await axios.get("/api/auth/active-api-key");
    return response.data;
  },
};
