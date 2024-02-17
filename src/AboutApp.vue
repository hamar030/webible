<script setup lang="ts">
import { LinkIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <h1 class="text-3xl font-semibold">Way to contribute</h1>
  <div class="mt-2 flex flex-col">
    <a
      class="inline-flex p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
      href="https://github.com/hamar030/webible.git"
      ><span class="mr-2 inline"><LinkIcon class="h-5 w-5" /></span>Project on Github</a
    >
    <a
      class="inline-flex p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
      href="https://gist.github.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc"
      ><span class="mr-2 inline"><LinkIcon class="h-5 w-5" /></span>Data on Github</a
    >
  </div>
</template>
