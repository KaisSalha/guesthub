import baseConfig from "@guesthub/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  theme: {
    container: {
      center: true,
    },
  },
} satisfies Config;
