// import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    classSuffix: '',
    storageKey: 'webibleTheme'
  },
  srcDir: 'src/',
  ssr: true,
  dir: {
    public: './public/'
  },
  routeRules: {
    '/**': { prerender: true },
    '/bible/**': { isr: true },
    '/api/**': { cors: true }
  },
  plugins: [],
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@vueuse/nuxt',
    // 'nuxt-swiper',
    'nuxt-lodash',
    '@pinia/nuxt'
  ],
  vite: {
    vue: {},
    build: {
      target: 'esnext'
    }
    // plugins: [vue(), eslintPlugin()]
  },
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': 'postcss-nesting',
      tailwindcss: {},
      // 'postcss-preset-env': {
      //   features: { 'nesting-rules': false },
      // },
      autoprefixer: {},
      cssnano: {}
    }
  },
  pinia: {
    storesDirs: ['./src/stores/**']
  },
  // swiper: {
  //   // Swiper options
  //   //----------------------
  //   // prefix: 'Swiper',
  //   // styleLang: 'css',
  //   // modules: ['navigation', 'pagination'], // all modules are imported by default
  // },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  devtools: {
    enabled: true,
    vscode: {},

    timeline: {
      enabled: true
    }
  },
  devServer: {
    // loadingTemplate: false
  }
})
