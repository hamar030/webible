import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import AboutApp from './AboutApp.vue'
import BibleApp from './BibleApp.vue'
import BibleCodeApp from './BibleCodeApp.vue'
import NotFound from './NotFound.vue'

const routes = [
  {
    path: '/',
    component: App,
    children: [
      { path: '', redirect: '/bible' },
      { path: '/bible', component: BibleApp },
      { path: '/bible-code', component: BibleCodeApp },
      { path: '/about', component: AboutApp }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp({}).use(router)
app.mount('#app')
