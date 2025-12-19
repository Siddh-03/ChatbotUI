import api from "./api";

export const authService = {
  // --- AUTHENTICATION ---

  login: async (email, password) => {
    const payload = { email, password };
    const response = await api.post("/login", payload);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // We don't have the user object here, just email.
      // The hook will fetch the full profile via getUserProfile.
      localStorage.setItem("agentVerseUser", JSON.stringify({ email }));
    }
    return response.data;
  },

  signup: async (userData) => {
    const params = new URLSearchParams();
    params.append("email", userData.email);
    params.append("name", userData.name);
    params.append("phone_number", userData.phone_number);
    params.append("password", userData.password);
    params.append("profession_id", userData.profession_id);

    const response = await api.post("/register", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Check if registration was successful and if 'user' object is in response
    if (response.data.status === "pending" || response.status === 201) {
      // The backend returns the full user object in response.data.user
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
      } else {
        // Fallback if backend structure changes
        const tempUser = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone_number,
          profession_id: userData.profession_id,
        };
        localStorage.setItem("tempSignupData", JSON.stringify(tempUser));
      }
    }

    return response.data;
  },

  verifyEmailByEmail: async (email, code) => {
    const payload = { email: email, code: String(code) };
    return api.post("/verifyEmail", payload);
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
    // Fetches the current user's data using the token
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
    throw {
      response: {
        status: 501,
        data: { error: "Feature temporarily unavailable" },
      },
    };
  },
};
