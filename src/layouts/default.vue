<template>
  <div class="flex h-full min-h-screen w-full flex-col">
    <header>
      <AppHeader />
    </header>
    <header class="sr-only hidden md:block">
      <div class="mx-auto max-w-7xl px-4 py-6 text-black dark:text-white sm:px-6 lg:px-8">
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ appConfig.title }}</h1>
        <h6 class="font-md tracking-tight">
          <span class="inline-block">{{ appConfig.tag }}</span>
        </h6>
      </div>
    </header>
    <main class="flex-1">
      <div class="mx-auto max-w-7xl p-5 text-black dark:text-white md:px-6 md:py-6 lg:px-8">
        <div class="mx-auto min-h-96 p-5">
          <slot />
        </div>
      </div>
    </main>
    <footer>
      <AppFooter />
    </footer>
  </div>
</template>
<script setup>
import { useAppConfig } from '#app'
const appConfig = useAppConfig()
</script>
