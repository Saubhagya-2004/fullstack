import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envDir: "../",
  plugins: [tailwindcss(), react()],

  preview: {
    host: true,
    port: 3000,
    allowedHosts: ["biddinglive22.onrender.com"],
  },
});
