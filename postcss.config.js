export default {
  plugins: {
    // The library's config. tailwind.config.js belongs to the old Electron app and would
    // otherwise win Tailwind's lookup order, compiling token classes such as bg-primary
    // against variables the library never defines.
    tailwindcss: { config: "./tailwind.config.ts" },
    autoprefixer: {},
  },
};
