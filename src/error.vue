<template>
  <div class="h-full w-full">
    <div class="flex content-center justify-center">
      <div class="flex flex-col p-4 text-gray-800 dark:text-gray-200">
        <h1 class="flex text-center text-7xl">{{ error?.statusCode }}</h1>
        <div v-if="error?.statusCode == 404">
          <NuxtLink
            to="/"
            class="border-1 m-3 rounded-md p-2 outline-1 outline-gray-800 dark:outline-gray-200"
            >Back to the truth</NuxtLink
          >
        </div>
        <div v-else>
          <h1>error:</h1>
          <p class="rounded-md text-slate-600 dark:text-slate-400">
            {{ error?.cause }}
            <br />
            {{ error?.message }}
          </p>
          <h1>stack:</h1>
          <p>{{ h(error?.stack ?? 'div') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useError } from '#app'
import { h } from 'vue'
const error = useError()
</script>
