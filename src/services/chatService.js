// src/services/chatService.js
import api from "./api";
import axios from "axios";

// Configuration
const EXTERNAL_BOT_TOKEN = "mysecrettoken123";
const MENTAL_HEALTH_KEY =
  "7e5770f877366c727d05791020f01d5c48bb86395c65bfad5cd0645939863617";

export const chatService = {
  sendMessage: async (message, model, additionalData = {}) => {
    // External bots: include 'general' and route with marketing
    if (
      ["fitfusion", "marketing", "mental_health", "general"].includes(model)
    ) {
      let endpoint = "";
      let headers = { "Content-Type": "application/json" };
      let payload = {};

      switch (model) {
        case "fitfusion":
          endpoint = "/bot-api/ybai_fitfusionai";
          headers["Authorization"] = `Bearer ${EXTERNAL_BOT_TOKEN}`;
          payload = { query: message, top_k: 3 };
          break;

        // Route 'general' to the same place as 'marketing'
        case "marketing":
        case "general":
          endpoint = "/bot-api/ybai_marketingbot";
          headers["Authorization"] = `Bearer ${EXTERNAL_BOT_TOKEN}`;
          payload = { query: message, top_k: 2 };
          break;

        case "mental_health":
          endpoint = "/bot-api/ybai_mental_health_chatbot";
          headers["x-api-key"] = MENTAL_HEALTH_KEY;
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
        // Format the response so your UI can read it easily
        return formatBotResponse(response.data, model);
      } catch (error) {
        // Prefer the richer error handling from the 2nd file
        console.error("BOT API FAILED:", error);
        if (error.response) {
          console.error("SERVER RESPONSE:", error.response.data);
          // Return the error text to the chat UI so you can see it
          return { text: `Error: ${JSON.stringify(error.response.data)}` };
        }
        return {
          text: "Error: No response from AI Agent. Check your connection or API Key.",
        };
      }
    }

    // --- Internal / default chat (keeps using your internal API) ---
    // If you still need file-upload logic from the first file, you can
    // re‑add it here before the JSON-only fallback.

    const response = await api.post("/chat/send", { message, model });
    return response.data;
  },

  // History stays internal
  getHistory: async () => {
    const response = await api.get("/chat/history");
    return response.data;
  },
};

// --- Helper: format responses ---
// Ensures the UI always gets a clean "text" property
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

  // Fallback
  return { text: JSON.stringify(data) };
}
