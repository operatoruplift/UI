import type { Config } from "tailwindcss";

/**
 * Operator Uplift design tokens as a Tailwind CSS preset.
 * Consuming apps can extend this preset to inherit the full design system.
 *
 * Usage in tailwind.config.ts:
 *   import { upliftPreset } from "@operatoruplift/ui/tailwind-preset";
 *   export default { presets: [upliftPreset], ... }
 */
export const designTokens = {
  primary: "#E77630",
  secondary: "#F59E0B",
  background: "#050508",
  card: "#0c0c0c",
  foreground: "#ffffff",
  mutedForeground: "#9ca3af",
  border: "rgba(255, 255, 255, 0.05)",
  borderHover: "rgba(255, 255, 255, 0.1)",
  borderActive: "rgba(231, 118, 48, 0.3)",
  destructive: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
  radiusLg: "0.5rem",
  radiusMd: "0.375rem",
  radiusSm: "0.25rem",
  radiusXl: "0.75rem",
} as const;

export const upliftPreset: Partial<Config> = {
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
    },
  },
};
