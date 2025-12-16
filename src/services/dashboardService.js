import api from "./api";

export const dashboardService = {
  // GET ALL CHATBOTS
  // Endpoint: GET /chatbots
  getChatbots: async () => {
    const response = await api.get("/chatbots");
    return response.data;
  },
};
