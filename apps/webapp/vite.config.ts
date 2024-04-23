import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert({
      savePath: "../../.certs",
      force: false,
      hosts: ["guesthub.local", "api.guesthub.local"],
    }),
    react(),
    TanStackRouterVite(),
  ],
  server: {
    port: 3001,
    strictPort: true,
    host: "guesthub.local",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
