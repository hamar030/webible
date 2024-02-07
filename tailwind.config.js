/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.teal,
        neutral: colors.gray,
      },
    },
  },
  plugins: [],
}

