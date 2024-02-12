import './assets/main.css'

import { createApp } from 'vue'
import { ref, computed, } from 'vue'
import { createRouter,createWebHistory } from 'vue-router'

import App from './App.vue'
import BibleApp from './BibleApp.vue'
import BibleCodeApp from './BibleCodeApp.vue'
import NotFound from './NotFound.vue'

const Main = {template: "hello_world"}
const About = {template: "About\n <a href></a>"}
const routes = [
  { path: '/', component: App,
    children: [
      { path: '', redirect: '/bible' },
      { path: '/bible', component: BibleApp },
      { path: '/bible-code', component: BibleCodeApp },
      { path: '/about', component: About },
    ] },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp({}).use(router)
app.mount('#app')
