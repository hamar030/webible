// import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'

// const GITHUB_TOKEN = <string>process.env.GITHUB_TOKEN

/*
 * https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  colorMode: {
    classSuffix: '',
    storageKey: 'webibleTheme'
  },
  srcDir: 'src/',
  ssr: true,
  dir: {
    // public: '~~/public/'
  },
  routeRules: {
    '/**': { prerender: true },
    '/bible/**': { prerender: false, isr: 60 * 60 * 24 }, //one days
    '/bible-spa': { prerender: false, ssr: false },
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
    cssPath: '~/assets/tailwind.css'
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
    },
    storage: {
      // webible_db: {
      //   driver: 'github',
      //   // repo: 'gist/3ed4a54ec9f2e8e1721627714193fdcc',
      //   repo: 'gist/125675978871422e577fe9b3b50570b8',
      //   dir: '~~/.data/github',
      //   // ttl: 60 * 60 *24, // one days
      //   token: GITHUB_TOKEN
      // }
      // webible_db:{
      //   driver: 'netlifyBlobs',
      //   name: 'webible_db'
      // }
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    builder: 'vite',
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
