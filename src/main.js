import './assets/main.css'

import { createApp } from 'vue'
import { ref, computed } from 'vue'

import App from './App.vue'
import BibleApp from './BibleApp.vue'
import BibleCodeApp from './BibleCodeApp.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': App,
  '/bible': BibleApp,
  '/bible-code': BibleCodeApp
}

const currentPath = ref(window.location.pathname)

const currentView = computed(() => {
  return routes[currentPath.value || '/'] || NotFound
})

// route change
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.pathname
})

createApp(currentView.value).mount('#app')
