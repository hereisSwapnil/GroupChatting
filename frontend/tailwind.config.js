/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // Dynamically require the plugin
    (() => {
      try {
        return require("@tailwindcss/forms");
      } catch (e) {
        console.error("Plugin not loaded:", e);
        return null;
      }
    })(),
  ].filter(Boolean), // Remove any `null` values
};
