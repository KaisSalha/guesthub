import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import mkcert from "vite-plugin-mkcert";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert({
      savePath: "../../.certs",
      force: false,
      hosts: ["guesthub.internal", "api.guesthub.internal"],
      keyFileName: "localhost-key.pem",
      certFileName: "localhost.pem",
    }),
    react(),
    TanStackRouterVite(),
    Unfonts({
      google: {
        families: [
          {
            name: "Inter",
            styles: "wght@100;200;300;400;500;600;700;800;900",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
    host: "guesthub.internal",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
