import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    // Page title before " · Tracker"
    title?: string
    // Shows the bottom nav (the tab screens; not the check-in flow or Done)
    nav?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Your week', nav: true },
    },
    {
      path: '/one-thing',
      name: 'one-thing',
      component: () => import('../views/OneThingView.vue'),
      meta: { title: 'One thing of today', nav: true },
    },
  ],
})

// Each page gets its own title, so screen reader users and tabs know where they are
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Tracker` : 'Tracker'
})

export default router
