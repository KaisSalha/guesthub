import esbuild from "esbuild";
import { glob } from "glob";

// Find all entry points for your project
const entryPoints = glob.sync("./src/**/*.{js,jsx,ts,tsx}", {
	ignore: ["./node_modules/**", "./dist/**", "./build/**"],
});

esbuild
	.build({
		entryPoints: entryPoints,
		outdir: "./dist",
		format: "esm",
		bundle: false,
		splitting: true,
		sourcemap: false,
		loader: {
			".js": "jsx",
			".jsx": "jsx",
			".ts": "ts",
			".tsx": "tsx",
		},
	})
	.catch(() => process.exit(1));
