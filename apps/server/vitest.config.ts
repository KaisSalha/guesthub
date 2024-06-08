import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		reporters: ["default", "html"],
		globalSetup: ["./src/test/global-setup.ts"],
	},
});
