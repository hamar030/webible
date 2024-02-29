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
    public: '~~/public/'
  },
  routeRules: {
    '/**': { prerender: true },
    '/bible/**': { prerender: false, isr: 3600 }, //add to isr:true 
    '/bible-spa/': { prerender: false, ssr: false },
    '/api/**': { cors: true }
  },
  plugins: [],
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@nuxtjs/fontaine',
    '@vueuse/nuxt',
    // 'nuxt-swiper',
    'nuxt-lodash',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
    // '@vite-pwa/nuxt'
  ],
  vite: {
    vue: {},
    build: {
      target: 'esnext'
    }
    // plugins: [vue(), eslintPlugin()]
  },
  tailwindcss: {
    configPath: '~~/.config/tailwindcss',
    cssPath: '~/assets/tailwind.css',
  },
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      // tailwindcss: { config: './tailwindcss' },
      'tailwindcss/nesting': 'postcss-nesting',
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
  // pwa: {
  //   /* PWA options */
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
  },
  experimental: {
    componentIslands: true // false or 'local+remote'
  }
})
