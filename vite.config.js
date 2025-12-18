import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chatbots Proxy (Keep as is)
      "/bot-api": {
        target: "http://multiai-chatbots.ybaisolution.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot-api/, ""),
        secure: false,
      },
      // NEW UNIVERSAL PROXY
      proxy: {
      // Catch calls to "/backend" and redirect them
      '/backend': {
        target: 'http://multiai-chatbots.ybaisolution.com/api/auth/register', // Point to the auth folder
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, ''), // Remove "/backend" from the path
      },
      // If you have other API calls not in auth
      '/api': {
        target: 'http://multiai-chatbots.ybaisolution.com/api',
        changeOrigin: true,
        secure: false,
      },
    }
    },
  },
});
