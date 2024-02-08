import './assets/main.css'

import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import Home from './pages/Home.vue'
import favorites from './pages/Favorites.vue'

const app = createApp(App)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: favorites
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(router)
app.use(autoAnimatePlugin)

app.mount('#app')
