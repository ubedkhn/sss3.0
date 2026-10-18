import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const flootOrigin = "https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: true,
    proxy: {
      // Keep existing Floot backend endpoints available during local development.
      "/_api": {
        target: flootOrigin,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "",
      },
    },
  },
  preview: { host: "0.0.0.0", port: 4173 },
});
