<template>
  <div class="h-full w-full">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <suspense>
        <NuxtPage />
      </suspense>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useHead, useSeoMeta, useAppConfig, useColorMode, computed } from '#imports'
import color from 'tailwindcss/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()
useSeoMeta({
  // aplicationName: 'Webible',
  title: appConfig.title,
  description: appConfig.description,
  charset: 'UTF-8',
  viewport: { width: 'device-width', initialScale: 1.0 },
  robots: 'index,follow',
  themeColor: computed(() => {
    if (colorMode.preference === 'light') {
      return color.neutral[100]
    } else if (colorMode.preference === 'dark') {
      return color.slate[800]
    } else {
      return [
        { content: color.sky[100], media: '(prefers-color-scheme: light)' },
        { content: color.slate[800], media: '(prefers-color-scheme: dark)' }
      ]
    }
  }),
  mobileWebAppCapable: 'yes',
  contentType: 'text/html; charset=utf-8',
  // og
  ogSiteName: appConfig.title,
  ogTitle: appConfig.title,
  ogDescription: appConfig.description,
  ogLocale: 'en',
  ogImage: '[og:image]',
  ogUrl: 'webible.netlify.app',
  ogType: 'website',
  // social media
  twitterTitle: '[twitter:title]',
  twitterDescription: '[twitter:description]',
  twitterImage: '[twitter:image]',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: appConfig.icon
    }
  ]
})
</script>
