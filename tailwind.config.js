/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        coal: "#141414",
        bone: "#F4EFE6",
        // The accent colour follows the visitor's chosen colourway (see src/lib/theme.js).
        sun: "rgb(var(--sun) / <alpha-value>)",
        flame: "#FF5A1F",
        mint: "#7DF0B0",
        ruby: "#D7263D",
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
