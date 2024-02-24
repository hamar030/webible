<template>
  <div class="h-full w-full">
    <!-- <NuxtLayout> -->
    <transition
      enter-active-class="transition-opacity transition-transform ease-out duration-75"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity easy-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="loading"
        class="z-100 fixed inset-x-0 top-0 block h-0.5 w-full bg-sky-700 shadow-lg dark:bg-sky-500"
      >
        <!-- <NuxtLoadingIndicator color="blue" /> -->
      </div>
    </transition>
    <suspense>
      <NuxtPage />
    </suspense>
    <!-- </NuxtLayout> -->
  </div>
</template>
<script async setup lang="ts">
import { ref } from 'vue'
// import { useHead, useSeoMeta } from 'unhead'
import { useNuxtApp, useRouter, useHead, useSeoMeta } from '#imports'

useSeoMeta({
  ogTitle: 'Webible',
  ogDescription: 'Bible Webb App',
  ogImage: '[og:image]',
  ogUrl: '[og:url]',
  twitterTitle: '[twitter:title]',
  twitterDescription: '[twitter:description]',
  twitterImage: '[twitter:image]',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  title: 'Webible',
  // link: [{ rel: 'icon', href: '/favicon.ico' }],
  meta: [
    { name: 'description', content: 'Bible Web App' },
    { name: 'charset', content: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'theme-color', content: '#dbeafe', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#872e4e', media: '(prefers-color-scheme: dark)' }
  ]
})

const nuxtApp = useNuxtApp()
const router = useRouter()
const loading = ref(true)

nuxtApp.hook('page:loading:start', () => {
  loading.value = true
})
nuxtApp.hook('page:loading:end', () => {
  loading.value = false
})
router.beforeEach(() => {
  loading.value = true
})
</script>
