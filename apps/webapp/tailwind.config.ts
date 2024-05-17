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
    extend: {
      keyframes: {
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        slideOut: "slideOut 0.5s forwards",
      },
    },
  },
} satisfies Config;
