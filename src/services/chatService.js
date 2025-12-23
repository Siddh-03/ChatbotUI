// src/services/chatService.js
import api from "./api";
import axios from "axios";

// NOTE: If the Mental Health key is invalid, use authService.fetchActiveApiKey() to get a fresh one.
const MENTAL_HEALTH_KEY =
  "7e5770f877366c727d05791020f01d5c48bb86395c65bfad5cd0645939863617";

export const chatService = {
  sendMessage: async (message, model, additionalData = {}) => {
    // External bots: fitfusion, marketing, mental_health, general
    if (
      ["fitfusion", "marketing", "mental_health", "general"].includes(model)
    ) {
      let endpoint = "";
      let headers = { "Content-Type": "application/json" };
      let payload = {};

      // FIX: Use the actual user token from localStorage
      const token = localStorage.getItem("authToken");

      switch (model) {
        case "fitfusion":
          endpoint = "/bot-api/ybai_fitfusionai";
          if (token) headers["Authorization"] = `Bearer ${token}`;
          payload = { query: message, top_k: 3 };
          break;

        case "marketing":
        case "general":
          endpoint = "/bot-api/ybai_marketingbot";
          if (token) headers["Authorization"] = `Bearer ${token}`;
          payload = { query: message, top_k: 2 };
          break;

        case "mental_health":
          endpoint = "/bot-api/ybai_mental_health_chatbot";
          headers["x-api-key"] = MENTAL_HEALTH_KEY;
          if (token) headers["Authorization"] = `Bearer ${token}`;
          payload = {
            query: message,
            health_data: additionalData.health_data || {
              sleep: "6 hours",
              stress: "medium",
              exercise: "moderate",
              mood: "anxious",
            },
            language: "en",
          };
          break;
      }

      try {
        const response = await axios.post(endpoint, payload, { headers });
        return formatBotResponse(response.data, model);
      } catch (error) {
        console.error("BOT API FAILED:", error);
        if (error.response) {
          console.error("SERVER RESPONSE:", error.response.data);
          return { text: `Error: ${JSON.stringify(error.response.data)}` };
        }
        return {
          text: "Error: No response from AI Agent. Check your connection.",
        };
      }
    }

    // Internal chat fallback
    const response = await api.post("/chat/send", { message, model });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/chat/history");
    return response.data;
  },
};

function formatBotResponse(data, model) {
  if (model === "fitfusion" || model === "mental_health") {
    if (data.results && Array.isArray(data.results)) {
      return { text: data.results.join("\n\n") };
    }
    if (typeof data.results === "string") {
      return { text: data.results };
    }
    return { text: JSON.stringify(data) };
  }

  if (model === "marketing" || model === "general") {
    return { text: data.response || JSON.stringify(data) };
  }

  return { text: JSON.stringify(data) };
}