import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // --- FIX: MOVED THIS TO THE TOP ---
      // This must be BEFORE "/api" because "/api-admin" starts with "/api"
      "/api-admin": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        // Rewrite removes "/api-admin" so the target receives "/api/admin/login"
        rewrite: (path) => path.replace(/^\/api-admin/, ""),
      },

      // Existing Chatbots Proxy
      "/bot-api": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot-api/, ""),
        secure: false,
      },

      // UNIVERSAL PROXY
      "/backend": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, "/api/user"),
      },

      // General API fallback
      // This must be BELOW "/api-admin"
      "/api": {
        target: "http://multiai-chatbots.ybaisolution.com/api",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
