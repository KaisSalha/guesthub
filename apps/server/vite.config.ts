import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import path from "path";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
	plugins: [
		mkcert({
			savePath: "../../.certs",
			force: false,
			hosts: ["guesthub.local", "api.guesthub.local"],
		}),
		...VitePluginNode({
			adapter: "fastify",
			appPath: "./src/index.ts",
			exportName: "app",
		}),
	],
	server: {
		port: 3000,
		strictPort: true,
		host: "api.guesthub.local",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
