<template>
  <div class="flex h-full min-h-screen w-full flex-col">
    <header>
      <AppHeader />
    </header>
    <header
      class="hidden bg-neutral-100 text-slate-800 shadow-lg dark:bg-slate-800 dark:text-white md:block"
    >
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:min-h-48 lg:px-8">
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ appConfig.title }}</h1>
        <h6 class="font-md tracking-tight">
          <span class="inline-block">{{ appConfig.description }}</span>
        </h6>
      </div>
    </header>
    <main class="flex-1">
      <div class="mx-auto max-w-7xl md:px-6 md:py-6 lg:px-8">
        <div
          class="mx-auto min-h-96 bg-white p-5 text-black shadow-lg dark:bg-slate-900 dark:text-white md:-mt-32 md:rounded-lg"
        >
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
<style scoped>

</style>
