import api from "./api";

export const chatService = {
  // SEND MESSAGE
  sendMessage: async (message, model, attachments = []) => {
    // Using FormData if you are sending files, otherwise just JSON
    if (attachments.length > 0) {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("model", model);
      attachments.forEach((file) => formData.append("files", file));

      return api.post("/chat/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // Standard JSON message
    const response = await api.post("/chat/send", { message, model });
    return response.data; // Expecting: { text: "AI Response...", ... }
  },

  // GET HISTORY
  getHistory: async () => {
    const response = await api.get("/chat/history");
    return response.data; // Expecting: [{ id: 1, title: "Chat 1", ... }, ...]
  },
};
