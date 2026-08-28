/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        chile: {
          red: "#D52B1E",
          "red-dark": "#B01F14",
          blue: "#0039A6",
          "blue-dark": "#002673",
          star: "#FFFFFF",
          gold: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
