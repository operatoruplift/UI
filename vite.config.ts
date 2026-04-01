import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: [
        "src/index.ts",
        "src/tailwind-preset.ts",
        "src/lib/**/*.ts",
        "src/hooks/**/*.ts",
        "src/components/**/*.tsx",
        "src/components/**/*.ts",
      ],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx", "src/**/*.test.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "tailwind-preset": resolve(__dirname, "src/tailwind-preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    sourcemap: true,
  },
});
