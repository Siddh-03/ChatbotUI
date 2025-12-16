import api from "./api";

export const subscriptionService = {
  // GET ALL PLANS
  // Endpoint: GET /subscriptions
  getSubscriptions: async () => {
    const response = await api.get("/subscriptions");
    return response.data;
  },

  // UPGRADE PLAN
  // Endpoint: POST /subscriptions/upgrade
  upgradePlan: async (chatbotId, planId) => {
    const response = await api.post("/subscriptions/upgrade", {
      chatbotId,
      planId,
    });
    return response.data;
  },
};
