<script setup>
//import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
import NavBarTop from './components/NavBarTop.vue'
import NavBarBottom from './components/NavBarBottom.vue'
import BibleContents from './components/BibleContents.vue'

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <NavBarTop />
  <header>
  </header>
  <main>
  <body class="">
    <div class="flex flex-col">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          {{ msg }}
              <BibleContents />
        </div>
      </div>
    </div>
  </body>
</main>

  <!--Footer container-->
  <footer class="flex flex-col items-center bg-neutral-100 text-center dark:bg-neutral-600 lg:text-left">
    <NavBarBottom />
  </footer>
</template>

<style scoped></style>
