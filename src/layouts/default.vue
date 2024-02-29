<template>
  <div class="flex h-full min-h-screen w-full flex-col">
    <header>
      <appHeader />
    </header>
    <header
      class="hidden bg-neutral-100 text-slate-800 shadow-lg md:block dark:bg-slate-800 dark:text-white"
    >
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:min-h-48 lg:px-8">
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ appConfig.title }}</h1>
        <h6 class="font-md tracking-tight">
          <span class="inline-block">{{ appConfig.description }}</span>
        </h6>
      </div>
    </header>
    <main class="flex-1">
      <div class="mx-auto max-w-7xl text-black md:px-6 md:py-6 lg:px-8 dark:text-white">
        <div
          class="mx-auto min-h-96 bg-white p-5 shadow-lg md:-mt-32 md:rounded-lg dark:bg-slate-900"
        >
          <slot />
        </div>
      </div>
    </main>
    <footer>
      <appFooter />
    </footer>
  </div>
</template>
<script setup lang="ts">
import { useAppConfig } from '#app'
const appConfig = useAppConfig()
</script>
<style scoped></style>
