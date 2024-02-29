import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import typography from '@tailwindcss/typography'

export default {
  content: [
    '../src/app/**/*.{js,vue,ts}',
    '../src/components/**/*.{js,vue,ts}',
    '../src/composables/**/*.{js,vue,ts}',
    '../src/layouts/**/*.vue',
    '../src/pages/**/*.vue',
    '../src/plugins/**/*.{js,ts}',
    '../src/app.vue',
    '../src/error.vue'
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
      }
    }
  },
  plugins: [typography]
} satisfies Config
