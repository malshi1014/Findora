import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Forward all /findora-backend requests to Apache on port 80.
      // This makes API calls same-origin, so the session cookie
      // (SameSite=Lax) is sent automatically on every request.
      "/findora-backend": {
        target: "http://localhost:80",
        changeOrigin: true,
      },
    },
  },
});