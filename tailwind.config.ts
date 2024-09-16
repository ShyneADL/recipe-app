/** @type {import('tailwindcss').Config} */
import fluid, { extract } from "fluid-tailwind";
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  extract,
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "black-100": "#2B2C35",
        lightGrey: "#E6E6EA",
        "primary-blue": {
          DEFAULT: "#2B59FF",
          100: "#F5F8FF",
        },
        "primary-red": {
          DEFAULT: "#FC0000",
          100: "#F1E8E8",
        },

        "secondary-orange": "#f79761",
        "light-white": {
          DEFAULT: "rgba(59,60,152,0.03)",
          100: "rgba(59,60,152,0.02)",
        },
        grey: "#747A88",
      },
      backgroundImage: {
        pattern: "url('/pattern.png')",
        "hero-bg": "url('/hero-bg.png')",
      },
    },
  },
  plugins: [fluid],
};
