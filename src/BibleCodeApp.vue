<script setup>
import { onMounted, ref } from 'vue'
import App from './App.vue'

let msg = ref('Hello Code')
onMounted(() => {
  document.getElementById('appContents').append(msg.value)
})
</script>
<template>
  <App />
</template>
