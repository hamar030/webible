<script setup lang="ts">
import { onMounted, ref } from 'vue'

const msg = ref('Hello Code...')
onMounted(async () => {})
</script>
<template>
  <article>
    <p>{{ msg }}</p>
  </article>
</template>
