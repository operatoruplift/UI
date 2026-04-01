import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./.storybook/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--ou-background)",
        foreground: "var(--ou-foreground)",
        primary: {
          DEFAULT: "var(--ou-primary)",
          foreground: "var(--ou-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--ou-secondary)",
          foreground: "var(--ou-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--ou-accent)",
          foreground: "var(--ou-accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--ou-muted)",
          foreground: "var(--ou-muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--ou-destructive)",
          foreground: "var(--ou-destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--ou-card)",
          foreground: "var(--ou-card-foreground)",
        },
        border: "var(--ou-border)",
        input: "var(--ou-input)",
        ring: "var(--ou-ring)",
      },
      borderRadius: {
        lg: "var(--ou-radius-lg)",
        md: "var(--ou-radius-md)",
        sm: "var(--ou-radius-sm)",
        xl: "var(--ou-radius-xl)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(8px)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "progress-indeterminate": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        "skeleton-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "dot-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.75)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-out": "fade-out 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "progress-indeterminate": "progress-indeterminate 1.5s ease-in-out infinite",
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
        "dot-pulse": "dot-pulse 1.5s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
