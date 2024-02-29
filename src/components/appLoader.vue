<template>
  <div>
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
        class="fixed inset-x-0 top-0 z-[1000] block h-0.5 w-full bg-sky-700 shadow-lg dark:bg-sky-500"
      ></div>
    </transition>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp, useRouter, ref } from '#imports'
const nuxtApp = useNuxtApp()
const router = useRouter()
const loading = ref(true)

/**
 * for time measure in debugging
 */
// if (process.env.NODE_ENV !== 'production') console.time(`${useRoute().path.toString()} finish in: `)

// if (process.env.NODE_ENV !== 'production')
//   console.timeEnd(`${useRoute().path.toString()} finish in: `)

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

<style></style>
