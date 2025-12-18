import api from "./api";

export const authService = {
  // 6. Login (Root Level)
  login: async (email, password) => {
    // URL becomes: /backend/login/ -> http://server.com/login/
    const response = await api.post("/login/", { email, password });

    if (response.data.status === "success" || response.data.token) {
      const token = response.data.token || response.data.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("agentVerseUser", JSON.stringify({ email }));
      }
    }
    return response.data;
  },

  // 1. Register User (Root Level)
  signup: async (userData) => {
    // URL becomes: /backend/register/ -> http://server.com/register/
    const response = await api.post("/register", userData);
    return response.data;
  },

  // 7. Logout (Root Level)
  logout: async () => {
    try {
      await api.post("/logout/");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("agentVerseUser");
    window.location.href = "/login";
  },

  // --- PASSWORD RECOVERY (Root Level based on your list) ---
  forgotPassword: async (email) => {
    return api.post("/forgot-password/", { email });
  },

  verifyOtp: async (email, otp) => {
    return api.post("/verify-otp/", { email, otp });
  },

  resetPassword: async (email, otp, newPassword) => {
    return api.post("/reset-password/", {
      email,
      otp,
      new_password: newPassword,
      confirm_new_password: newPassword,
    });
  },

  // --- USER PROFILE (Nested under /api/) ---

  // 8. Get User
  getUserProfile: async () => {
    // URL becomes: /backend/api/user/ -> http://server.com/api/user/
    return api.get("/api/user/");
  },

  // 9. Update Profile Photo
  updateProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append("profile_photo", file);
    return api.put("/api/user/update-photo/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 10. Change Password (Root Level)
  changePassword: async (email, oldPassword, newPassword) => {
    return api.post("/change_password/", {
      email,
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  verifyEmailByEmail: async (email, code) => {
    return api.post("/verifyEmailbyemail/", { email, verification_code: code });
  },
};
