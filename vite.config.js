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
      // FIXED UNIVERSAL PROXY
      // This catches calls to "/backend" (from your api.js) and forwards them
      "/backend": {
        // Target is the DOMAIN, not the full path
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        secure: false,
        // Rewrite "/backend" to "/api/auth" to match the API structure
        // Request: /backend/register -> Target: .../api/auth/register
        rewrite: (path) => path.replace(/^\/backend/, "/api/auth"),
      },
      // General API fallback if needed (optional)
      "/api": {
        target: "http://multiai-chatbots.ybaisolution.com/api",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
