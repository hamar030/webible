<template>
  <div>
    <section>
      <h1 class="py-2 text-4xl font-bold">About</h1>
      <div class="mt-5 md:hidden">
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ appConfig.title }}</h1>
        <h6 class="font-md tracking-tight">
          <span class="inline-block">{{ appConfig.description }}</span>
        </h6>
      </div>
      <div class="mt-5">
        <h1 class="text-2xl font-semibold">Way to contribute</h1>
        <div class="mt-2 flex flex-col">
          <a
            class="inline-flex p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            href="https://github.com/hamar030/webible.git"
            ><span class="mr-2 inline"> <LinkIcon class="h-4 w-4" /> </span>Project on Github</a
          >
          <a
            class="inline-flex p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            href="https://gist.github.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc"
            ><span class="mr-2 inline"> <LinkIcon class="h-4 w-4" /> </span>Data on Github</a
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { LinkIcon } from '@heroicons/vue/24/outline'
import { useAppConfig } from '#imports'

const appConfig = useAppConfig()
</script>
<style scoped>
</style>
