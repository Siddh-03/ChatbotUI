// src/services/userService.js
import api from "./api";

export const userService = {
  // --- PROFILE ---

  // GET /api/user/me
  getProfile: async () => {
    return api.get("/me");
  },

  // PUT /api/user/me/profile-photo
  updateProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append("profile_photo", file);
    return api.put("/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // NOTE: Your backend (user 1.py) DOES NOT have an endpoint to update Name/Phone.
  // We can only update Photo and Password for now.
  // If you need name update, you must add a route in user 1.py.

  // --- SECURITY ---

  // POST /api/user/change-password
  changePassword: async (oldPassword, newPassword) => {
    return api.post("/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // DELETE /api/user/delete-account
  deleteAccount: async () => {
    return api.delete("/delete-account");
  },

  // --- DATA ---

  // Mocking data export since backend doesn't have it yet
  exportData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ url: "/mock-data-export.json" }), 1000);
    });
  },
};
