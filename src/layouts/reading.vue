<template>
  <div class="flex h-full min-h-screen w-full flex-col">
      <appHeader />
    <main class="flex-1 shadow-lg -mt-24 bg-white dark:bg-neutral-950">
      <div class="mx-auto max-w-7xl p-5 md:px-6 md:py-6 lg:px-8 text-black dark:text-white">
        <div class="mx-auto min-h-96">
          <slot />
        </div>
      </div>
    </main>
      <appFooter />
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped lang="pcss">
</style>
