import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react")) {
            return "react-vendor";
          }
          if (
            id.includes("node_modules/@reduxjs") ||
            id.includes("node_modules/react-redux")
          ) {
            return "redux-vendor";
          }
        },
      },
    },
  },
});
