/* eslint-disable no-undef */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["'Great Vibes'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
