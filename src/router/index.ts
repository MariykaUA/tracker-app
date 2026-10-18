import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { isTrackerId, TRACKERS } from '@/constants/trackers'
import HomeView from '../views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    // Page title before " · Tracker"; a function when it depends on the route
    title?: string | ((to: RouteLocationNormalized) => string)
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
    {
      path: '/tracker/:id',
      name: 'tracker',
      component: () => import('../views/TrackerView.vue'),
      // An unknown tracker in the address goes back to Home
      beforeEnter: (to) => isTrackerId(to.params.id) || { name: 'home', replace: true },
      props: (to) => ({ trackerId: to.params.id }),
      meta: {
        title: (to) => (isTrackerId(to.params.id) ? TRACKERS[to.params.id].name : ''),
        nav: true,
      },
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('../views/CheckinView.vue'),
      meta: { title: 'Check-in' },
    },
    {
      path: '/done',
      name: 'done',
      component: () => import('../views/DoneView.vue'),
      meta: { title: "You're done for today" },
    },
  ],
})

// Each page gets its own title, so screen reader users and tabs know where they are
router.afterEach((to) => {
  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title
  document.title = title ? `${title} · Tracker` : 'Tracker'
})

export default router
