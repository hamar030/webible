/* eslint-disable no-undef */

/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './composables/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
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
