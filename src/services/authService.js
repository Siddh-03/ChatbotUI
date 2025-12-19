import api from "./api";

export const authService = {
  // --- AUTHENTICATION ---

  // 1. Login
  login: async (email, password) => {
    const payload = { email, password };
    // Backend: @userBp.route("/login")
    const response = await api.post("/login", payload);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // Store basic email to help with state recovery
      localStorage.setItem("agentVerseUser", JSON.stringify({ email }));
    }
    return response.data;
  },

  // 2. Register User
  signup: async (userData) => {
    const params = new URLSearchParams();
    params.append("email", userData.email);
    params.append("name", userData.name);
    params.append("phone_number", userData.phone_number);
    params.append("password", userData.password);
    params.append("profession_id", userData.profession_id);

    // Backend: @userBp.route("/register")
    const response = await api.post("/register", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // CACHE FIX: Store phone/profession locally since /me endpoint doesn't return them yet
    if (response.data.status === "pending" || response.status === 201) {
      const tempUser = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone_number,
        profession_id: userData.profession_id,
      };
      localStorage.setItem("tempSignupData", JSON.stringify(tempUser));
    }

    return response.data;
  },

  // 3. Verify Email
  verifyEmailByEmail: async (email, code) => {
    const payload = {
      email: email,
      code: String(code), // Backend expects 'code'
    };

    // Backend: @userBp.route("/verifyEmail")
    return api.post("/verifyEmail", payload, {
      transformRequest: [
        (data, headers) => {
          delete headers.Authorization;
          return JSON.stringify(data);
        },
      ],
      headers: { "Content-Type": "application/json" },
    });
  },

  // 4. Logout
  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("agentVerseUser");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  },

  // --- PASSWORD ---

  forgotPassword: async (email) => {
    // Backend: @userBp.route("/forgot-password")
    return api.post("/forgot-password", { email });
  },

  verifyOtp: async (email, otp) => {
    // Backend: @userBp.route("/verify-otp")
    return api.post("/verify-otp", { email, otp });
  },

  resetPassword: async (email, otp, newPassword) => {
    // Backend: @userBp.route("/reset-password")
    return api.post("/reset-password", {
      email,
      otp,
      new_password: newPassword,
    });
  },

  changePassword: async (email, oldPassword, newPassword) => {
    // Backend: @userBp.route("/change-password")
    // Note: Backend uses JWT user_id, so 'email' arg is unused but kept for interface consistency
    return api.post("/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // --- PROFILE ---

  getUserProfile: async () => {
    // Backend: @userBp.route("/me")
    // Returns: { user_id, email, name, is_verified }
    return api.get("/me");
  },

  updateProfilePhoto: async (file) => {
    // Backend: @userBp.route("/me/profile-photo")
    const formData = new FormData();
    formData.append("profile_photo", file);
    return api.put("/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // --- DELETION ---
  deleteAccount: async () => {
    // BACKEND LIMITATION: No delete endpoint provided in current backend code.
    // Throwing error to be handled by UI.
    throw {
      response: {
        status: 501,
        data: { error: "Feature temporarily unavailable" },
      },
    };
  },
};
