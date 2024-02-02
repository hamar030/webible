<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import BibleContents from './components/BibleContents.vue'

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header>
  </header>
  <main>
    <h1>webible</h1>
    <p>{{ msg }}</p>
    <BibleContents />
    <p>

      
      Note: Remember reading bible from torah scroll or bible book is more better than this.
      :)
    </p>
  </main>
</template>

<style scoped>

</style>
