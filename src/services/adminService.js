import axios from "axios";

// API Configuration
const API_URL = "http://localhost:5000"; // Adjust if your Flask runs elsewhere
const ADMIN_TOKEN =
  "8k5770f877366c727d05791020f01d5c48bb86395c65bfad5cd0645939863627";

// Helper: Get logged-in Admin ID
const getAdminId = () => {
  const admin = JSON.parse(localStorage.getItem("adminUser"));
  return admin?.admin_id;
};

// 1. Client for Auth Routes (Requires Static Token Header)
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
});

// 2. Client for Resource Routes (Requires admin_id in body)
const resourceClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to inject admin_id into every resource request
resourceClient.interceptors.request.use((config) => {
  const adminId = getAdminId();
  if (config.method !== "get") {
    config.data = { ...config.data, admin_id: adminId };
  } else {
    // For GET requests that require body (rare but present in your python)
    config.data = { admin_id: adminId };
  }
  return config;
});

export const adminService = {
  // --- AUTHENTICATION ---
  login: async (email, password) => {
    const response = await authClient.post("/admin/login", { email, password });
    if (response.data.status === "success") {
      localStorage.setItem("adminUser", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  registerAdmin: async (adminData) => {
    return await authClient.post("/admin/register", {
      ...adminData,
      admin_id: getAdminId(), // Superadmin ID needed to register others
    });
  },

  logout: () => {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  },

  // --- USER MANAGEMENT ---
  getAllUsers: async () => {
    return await resourceClient.post("/admin/get-users");
  },
  updateUser: async (userData) => {
    return await resourceClient.put("/admin/user-update", userData);
  },
  deleteUser: async (user_id) => {
    return await resourceClient.delete("/admin/user-delete", {
      data: { admin_id: getAdminId(), user_id },
    });
  },
  getUserDocuments: async (user_id) => {
    return await resourceClient.post("/admin/viewUserDocuments", { user_id });
  },

  // --- BOT MANAGEMENT ---
  getAllBots: async () => {
    return await resourceClient.post("/admin/get-bots");
  },
  createBot: async (botData) => {
    return await resourceClient.post("/admin/create-bot", botData);
  },
  updateBot: async (botData) => {
    return await resourceClient.put("/admin/bot-update", botData);
  },
  deleteBot: async (bot_id) => {
    return await resourceClient.delete("/admin/bot-delete", {
      data: { admin_id: getAdminId(), bot_id },
    });
  },

  // --- PLAN MANAGEMENT ---
  getAllPlans: async () => {
    return await resourceClient.post("/admin/plans");
  },
  createPlan: async (planData) => {
    return await resourceClient.post("/admin/create-plan", planData);
  },
  updatePlan: async (planData) => {
    return await resourceClient.put("/admin/plan-update", planData);
  },
  deletePlan: async (plan_id) => {
    return await resourceClient.delete("/admin/plan-delete", {
      data: { admin_id: getAdminId(), plan_id },
    });
  },

  // --- SUBSCRIPTIONS ---
  getAllSubscriptions: async () => {
    return await resourceClient.post("/admin/subscriptions-all");
  },

  // --- FEEDBACKS ---
  getAllFeedbacks: async () => {
    // Note: Python backend defines this as GET but expects body data.
    // Axios supports body in GET via 'data' config, but some proxies strip it.
    return await resourceClient.get("/admin/feedbacks-all", {
      data: { admin_id: getAdminId() },
    });
  },
  deleteFeedback: async (feedback_id) => {
    return await resourceClient.delete("/admin/feedback-delete", {
      data: { admin_id: getAdminId(), feedback_id },
    });
  },

  // --- PAYMENT DETAILS ---
  getAllPayments: async () => {
    return await resourceClient.post("/admin/payment-list");
  },
};
