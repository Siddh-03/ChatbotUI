import axios from "axios";

// Creates an instance pointing to /api-admin, which vite proxies to /api on the server
const adminApi = axios.create({
  baseURL: "/api-admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Admin Token (or fallback to user token)
adminApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminAuthToken") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // POST /api/admin/get-users
  getAllUsers: async () => {
    const response = await adminApi.post("/admin/get-users");
    return response.data;
  },

  // PUT /api/admin/user-update
  updateUser: async (userData) => {
    const response = await adminApi.put("/admin/user-update", userData);
    return response.data;
  },

  // DELETE /api/admin/user-delete
  deleteUser: async (userId) => {
    const response = await adminApi.delete("/admin/user-delete", {
      data: { user_id: userId },
    });
    return response.data;
  },

  // POST /api/admin/email-verifications
  getEmailVerifications: async () => {
    const response = await adminApi.post("/admin/email-verifications");
    return response.data;
  },
};
