// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← Registers Tailwind CSS via the official Vite plugin
  ],
  resolve: {
    alias: {
      "@": "/src", // optional alias for cleaner imports
    },
  },
});
