import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'
import { useEntriesStore } from './stores/entries.store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const entries = useEntriesStore()

// Sign in and get today's date from the server before mounting,
// so every view can rely on uid and todayKey being set. Waiting for the
// router too means the first page load isn't treated as a route change.
await Promise.all([useAuthStore().init(), entries.refreshToday(), router.isReady()])

// An app left open overnight moves to the new day when it comes back
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void entries.refreshToday()
})

app.mount('#app')
