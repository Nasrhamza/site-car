import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C1121F",
          dark: "#780000",
          electric: "#2563EB",
          gold: "#D4AF37"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"]
      },
      boxShadow: {
        premium: "0 20px 50px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
};

export default config;
