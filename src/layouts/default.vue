<template>
  <div class="flex h-full min-h-screen w-full flex-col">
    <appHeader />
    <main class="flex-1">
      <div class="mx-auto max-w-7xl text-black md:px-6 md:py-6 lg:px-8 dark:text-white">
        <div
          class="mx-auto min-h-96 bg-white p-5 shadow-lg md:-mt-32 md:rounded-lg dark:bg-slate-900"
        >
          <slot />
        </div>
      </div>
    </main>
    <appFooter />
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="pcss"></style>
