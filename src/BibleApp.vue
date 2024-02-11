<script setup>
import { createApp, onMounted } from 'vue'
import App from './App.vue'
import BibleContents from './components/BibleContents.vue'

onMounted(() => {
  createApp(BibleContents).mount('#appContents')
})
</script>
<template>
  <App />
</template>
