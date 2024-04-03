import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        brand: "hsl(var(--brand))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--bg))",
          surface: "hsl(var(--bg-surface))",
          muted: "hsl(var(--bg-muted))",
          subtle: "hsl(var(--bg-subtle))",
          inverted: "hsl(var(--bg-inverted))",
          popover: "hsl(var(--bg-background-popover))",

          info: "hsl(var(--bg-info))",
          success: "hsl(var(--bg-success))",
          attention: "hsl(var(--bg-attention))",
          destructive: "hsl(var(--bg-destructive))",
          error: "hsl(var(--bg-error))",
          darkerror: "hsl(var(--bg-dark-error))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          emphasis: "hsl(var(--border-emphasis))",
          subtle: `hsl(var(--border-subtle))`,
          muted: "hsl(var(--border-muted))",
          error: "hsl(var(--border-error))",
        },
        text: {
          DEFAULT: "hsl(var(--text))",
          emphasis: "hsl(var(--text-emphasis))",
          subtle: "hsl(var(--text-subtle))",
          muted: "hsl(var(--text-muted))",
          inverted: "hsl(var(--text-inverted))",

          info: "hsl(var(--text-info))",
          success: "hsl(var(--text-success))",
          attention: "hsl(var(--text-attention))",
          destructive: "hsl(var(--text-destructive))",
          error: "hsl(var(--text-error))",
          brand: "hsl(var(--brand-text))",
        },
        foreground: "hsl(var(--foreground))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
