import axios from "axios";

// Proxy prefix defined in vite.config.js
const API_URL = "/api-admin";

const ADMIN_TOKEN =
  "8k5770f877366c727d05791020f01d5c48bb86395c65bfad5cd0645939863627";

// Helper: Get logged-in Admin Data
const getAdminId = () => {
  const admin = JSON.parse(localStorage.getItem("adminUser"));
  return admin?.admin_id;
};

// 1. Client for Auth Routes
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
});

// 2. Client for Resource Routes
const resourceClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to automatically add the JWT Token from LocalStorage
resourceClient.interceptors.request.use((config) => {
  const adminData = JSON.parse(localStorage.getItem("adminUser"));
  const token = adminData?.token;
  const adminId = adminData?.admin_id;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject admin_id into body for endpoints that might need it explicitly
  if (config.method !== "get") {
    config.data = { ...config.data, admin_id: adminId };
  }
  return config;
});

export const adminService = {
  // --- AUTHENTICATION ---

  login: async (email, password) => {
    // FIX: Added trailing slash '/' at the end
    const response = await authClient.post("/api/admin/login/", {
      email,
      password,
    });

    if (response.data.token || response.data.status === "success") {
      localStorage.setItem("adminUser", JSON.stringify(response.data));
    }
    return response.data;
  },

  registerAdmin: async (adminData) => {
    // FIX: Added trailing slash
    return await authClient.post("/api/admin/register/", {
      ...adminData,
    });
  },

  logout: () => {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  },

  // --- ADMIN MANAGEMENT ---

  getAllAdmins: async () => {
    // FIX: Added trailing slash
    return await resourceClient.post("/api/admins/list/");
  },

  deleteAdmin: async (targetAdminId) => {
    // FIX: Added trailing slash
    return await resourceClient.post("/api/admins/delete/", {
      admin_id: targetAdminId,
    });
  },

  // --- USER MANAGEMENT ---

  getAllUsers: async () => {
    // FIX: Added trailing slash
    return await resourceClient.post("/api/admin/get-users/");
  },

  updateUser: async (userData) => {
    // FIX: Added trailing slash
    return await resourceClient.put("/api/admin/user-update/", userData);
  },

  deleteUser: async (user_id) => {
    // FIX: Added trailing slash
    return await resourceClient.delete("/api/admin/user-delete/", {
      data: { user_id },
    });
  },

  getUserDocuments: async (user_id) => {
    // FIX: Added trailing slash
    return await resourceClient.post("/api/admin/viewUserDocuments/", {
      user_id,
    });
  },

  // --- OTHER RESOURCES ---

  getAllBots: async () => {
    return await resourceClient.post("/api/admin/get-bots/");
  },

  createBot: async (botData) => {
    return await resourceClient.post("/api/admin/create-bot/", botData);
  },

  updateBot: async (botData) => {
    return await resourceClient.put("/api/admin/bot-update/", botData);
  },

  deleteBot: async (bot_id) => {
    return await resourceClient.delete("/api/admin/bot-delete/", {
      data: { bot_id },
    });
  },

  getAllPlans: async () => {
    return await resourceClient.post("/api/admin/plans/");
  },

  createPlan: async (planData) => {
    return await resourceClient.post("/api/admin/create-plan/", planData);
  },

  updatePlan: async (planData) => {
    return await resourceClient.put("/api/admin/plan-update/", planData);
  },

  deletePlan: async (plan_id) => {
    return await resourceClient.delete("/api/admin/plan-delete/", {
      data: { plan_id },
    });
  },

  getAllSubscriptions: async () => {
    return await resourceClient.post("/api/admin/subscriptions-all/");
  },

  getAllFeedbacks: async () => {
    return await resourceClient.get("/api/admin/feedbacks-all/");
  },

  deleteFeedback: async (feedback_id) => {
    return await resourceClient.delete("/api/admin/feedback-delete/", {
      data: { feedback_id },
    });
  },

  getAllPayments: async () => {
    return await resourceClient.post("/api/admin/payment-list/");
  },
};
