const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", fontFamily.sans],
        handwriting: ["Sacramento", fontFamily.serif],
      },
      colors: {
        primary: {
          100: "#8833ff",
          200: "#f9ac25",
          300: "#2BEBC8",
          400: "#8833ff",
        },
      },
    },
  },
  variants: {
    extend: {
      gradientColorStops: ["group-hover"],
      transitionDuration: ["group-hover"],
    },
  },
  plugins: [],
};
