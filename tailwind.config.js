/* eslint-disable no-undef */

/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: [
        'Heebo Variable',
        '"Nunito Sans Variable"',
        '"Noto Sans"',
        'system-ui',
        'sans-serif'
      ],
      body: ['Roboto', '"Nunito Variable"', '"Noto Sans"', 'system-ui', 'sans-serif']
    },
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.teal,
        neutral: colors.gray
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
