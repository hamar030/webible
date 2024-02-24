<template>
  <NuxtLink
    :aria-current="isActive ? 'page' : undefined"
    :class="[isActive ? 'active' : '']"
  >
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useAttrs, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { to } = useAttrs() as { to: string }
const isActive = computed(() => {
  const { path } = route
  return to === '/'
    ? path === to
    : path.toLowerCase().replace(/\s+/g, '') === to.toLowerCase().replace(/\s+/g, '')
})
</script>

<style></style>
