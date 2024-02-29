<template>
  <div class="copyright">
    <span class="inline-block"
      >WeBible @2024</span
    >
    |
    <span class="inline-block">Hosted by: <a href="https://netlify.com/">Netlify</a></span>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="pcss">
.copyright {
  @apply w-full p-4 text-center text-neutral-700 dark:text-neutral-200;
}

.copyright a {
  @apply text-neutral-800 dark:text-neutral-400;
}
</style>
