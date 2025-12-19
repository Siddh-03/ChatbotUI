import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Existing Chatbots Proxy
      "/bot-api": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot-api/, ""),
        secure: false,
      },
      // UNIVERSAL PROXY
      // This catches calls to "/backend" (from your api.js) and forwards them
      "/backend": {
        // Target is the DOMAIN
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        // Rewrite "/backend" to "/api/user" to match the new API structure
        // Request: /backend/register -> Target: .../api/user/register
        rewrite: (path) => path.replace(/^\/backend/, "/api/user"),
      },
      // General API fallback if needed
      "/api": {
        target: "http://multiai-chatbots.ybaisolution.com/api",
        changeOrigin: true,
        secure: false,
      },

      "/api-admin": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-admin/, ""),
      },
    },
  },
});
