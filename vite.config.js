import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Admin API: Maps /api-admin/admin/get-users -> /api/admin/get-users
      "/api-admin": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-admin/, "/api"),
      },

      // Chatbots API: Maps /bot-api/ybai_fitfusionai -> /ybai_fitfusionai
      "/bot-api": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot-api/, ""),
        secure: false,
      },

      // User API: Maps /backend/login -> /api/user/login
      "/backend": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, "/api/user"),
      },

      // General API: Fallback for /api/auth endpoints
      "/api": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
