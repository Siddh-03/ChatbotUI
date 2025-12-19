import axios from "axios";

// Proxy prefix defined in vite.config.js
// This forwards to http://multiai-chatbots.ybaisolution.com
const API_URL = "/api-admin";

// 1. Client for Public/Auth Routes (Login)
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Client for Protected Resources (Requires JWT)
const resourceClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to automatically add the JWT Token from LocalStorage
resourceClient.interceptors.request.use((config) => {
  try {
    console.log(`[Interceptor] Preparing request to: ${config.url}`);

    const adminDataString = localStorage.getItem("adminUser");
    console.log("[Interceptor] Raw LocalStorage 'adminUser':", adminDataString);

    if (adminDataString) {
      const adminData = JSON.parse(adminDataString);
      const token = adminData?.token;

      // 1. Attach Token
      if (token) {
        console.log("[Interceptor] ✅ Token found. Attaching to headers.");
        config.headers.Authorization = `Token ${token}`;
      } else {
        console.warn(
          "[Interceptor] ⚠️ 'adminUser' found, but NO 'token' inside it!",
          adminData
        );
      }

      // 2. Inject admin_id (if available and not already in body)
      const adminId = adminData?.admin_id;

      if (
        adminId &&
        config.method !== "get" &&
        config.data &&
        typeof config.data === "object"
      ) {
        console.log(`[Interceptor] Injecting admin_id: ${adminId}`);
        config.data = { admin_id: adminId, ...config.data };
      }
    } else {
      console.warn(
        "[Interceptor] ❌ No 'adminUser' found in LocalStorage. User is not logged in?"
      );
    }
  } catch (error) {
    console.error("[Interceptor] 💥 Error in admin interceptor:", error);
  }

  return config;
});

export const adminService = {
  // --- AUTHENTICATION ---

  login: async (email, password) => {
    const response = await authClient.post("/api/admin/login", {
      email,
      password,
    });

    console.log("[Login] Response Data:", response.data);

    if (response.data.token || response.data.status === "success") {
      localStorage.setItem("adminUser", JSON.stringify(response.data));
    }
    return response.data;
  },

  registerAdmin: async (adminData) => {
    return await resourceClient.post("/api/admin/register", { ...adminData });
  },

  logout: () => {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  },

  // --- ADMIN MANAGEMENT ---

  getAllAdmins: async () => {
    return await resourceClient.post("/api/admins/list", {});
  },

  deleteAdmin: async (targetAdminId) => {
    return await resourceClient.post("/api/admins/delete", {
      admin_id: targetAdminId,
    });
  },

  // --- USER MANAGEMENT ---

  getAllUsers: async () => {
    // Calling with empty object to ensure POST body exists
    return await resourceClient.post("/api/admin/get-users", {});
  },

  updateUser: async (userData) => {
    return await resourceClient.put("/api/admin/user-update", userData);
  },

  deleteUser: async (user_id) => {
    return await resourceClient.delete("/api/admin/user-delete", {
      data: { user_id },
    });
  },

  getUserDocuments: async (user_id) => {
    return await resourceClient.post("/api/admin/viewUserDocuments", {
      user_id,
    });
  },

  getEmailVerifications: async () => {
    return await resourceClient.post("/api/admin/email-verifications", {});
  },

  // --- OTHER RESOURCES ---

  getAllBots: async () => {
    return await resourceClient.post("/api/admin/get-bots", {});
  },

  createBot: async (botData) => {
    return await resourceClient.post("/api/admin/create-bot", botData);
  },

  updateBot: async (botData) => {
    return await resourceClient.put("/api/admin/bot-update", botData);
  },

  deleteBot: async (bot_id) => {
    return await resourceClient.delete("/api/admin/bot-delete", {
      data: { bot_id },
    });
  },

  getAllPlans: async () => {
    return await resourceClient.post("/api/admin/plans", {});
  },

  createPlan: async (planData) => {
    return await resourceClient.post("/api/admin/create-plan", planData);
  },

  updatePlan: async (planData) => {
    return await resourceClient.put("/api/admin/plan-update", planData);
  },

  deletePlan: async (plan_id) => {
    return await resourceClient.delete("/api/admin/plan-delete", {
      data: { plan_id },
    });
  },

  getAllSubscriptions: async () => {
    return await resourceClient.post("/api/admin/subscriptions-all", {});
  },

  getAllFeedbacks: async () => {
    return await resourceClient.get("/api/admin/feedbacks-all");
  },

  deleteFeedback: async (feedback_id) => {
    return await resourceClient.delete("/api/admin/feedback-delete", {
      data: { feedback_id },
    });
  },

  getAllPayments: async () => {
    return await resourceClient.post("/api/admin/payment-list", {});
  },
};
