// src/services/chatService.js
import api from "./api";
import axios from "axios";

export const chatService = {
  sendMessage: async (message, model, additionalData = {}) => {
    // 1. Get the Auth Token
    let token = localStorage.getItem("authToken");
    if (!token) {
      return { text: "Please login to use the bot." };
    }

    // --- AGGRESSIVE CLEANING ---
    // 1. Remove surrounding quotes ( "eyJ..." -> eyJ... )
    token = token.replace(/^"|"$/g, "");
    // 2. Remove "Bearer " prefix if it was stored in the string
    token = token.replace(/^Bearer\s+/i, "");
    // 3. Remove any accidental whitespace/newlines
    token = token.trim();

    // DEBUG: Look at your console. If this prints "Bearer Bearer...", that's the bug.
    console.log("Sanitized Token for Header:", token.substring(0, 20) + "...");

    // 2. Prepare Headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let endpoint = "";
    let payload = { query: message };

    try {
      // 3. Select Endpoint & Specific Logic
      switch (model) {
        case "fitfusion":
          endpoint = "/bot-api/ybai_fitfusionai";
          payload.top_k = 3;
          break;

        case "marketing":
        case "general":
          endpoint = "/bot-api/ybai_marketingbot";
          payload.top_k = 2;
          break;

        case "mental_health":
          endpoint = "/bot-api/ybai_mental_health_chatbot";

          // API Key Fetch using direct AXIOS (bypassing api.js interceptors)
          // Uses the '/api' proxy defined in vite.config.js
          const keyResponse = await axios.get("/api/auth/active-api-key");

          const dynamicKey = keyResponse.data.api_key;
          if (!dynamicKey) throw new Error("Could not fetch active API key");

          headers["x-api-key"] = dynamicKey;
          payload.health_data = additionalData.health_data || {
            sleep: "6 hours",
            stress: "medium",
            exercise: "moderate",
            mood: "anxious",
          };
          payload.language = "en";
          break;

        default:
          // Internal chat fallback
          const response = await api.post("/chat/send", { message, model });
          return response.data;
      }

      // 4. Send Request
      const response = await axios.post(endpoint, payload, { headers });
      return formatBotResponse(response.data, model);
    } catch (error) {
      console.error("BOT API ERROR:", error);

      // If 401, it means the token is technically "valid" format but rejected by server (expired/wrong secret)
      if (error.response?.status === 401) {
        console.error("401 Unauthorized. The server rejected the token.");
        console.error("Token sent:", token);

        // DO NOT Redirect automatically while debugging.
        // Just return the error text so you can see it in the chat bubble.
        return {
          text: "Session Error (401): Server rejected the token. Check console.",
        };
      }

      return {
        text:
          error.response?.data?.message || "Error connecting to AI service.",
      };
    }
  },

  getHistory: async () => {
    // If you are using history, make sure api.js is also cleaning the token
    try {
      const response = await api.get("/chat/history");
      return response.data;
    } catch (e) {
      return []; // Fail silently for history
    }
  },
};

function formatBotResponse(data, model) {
  if (data.results && Array.isArray(data.results))
    return { text: data.results.join("\n\n") };
  if (data.response) return { text: data.response };
  return { text: typeof data === "string" ? data : JSON.stringify(data) };
}
