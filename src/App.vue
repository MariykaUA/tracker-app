<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import PageAction from '@/components/layout/PageAction.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useStatusStore } from '@/stores/status.store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const status = useStatusStore()
const main = useTemplateRef<HTMLElement>('main')
const screen = useTemplateRef<HTMLElement>('screen')

// On every page change (not the first load), start the new screen at the top and
// move focus to its <h1>, so screen reader users hear which page opened
watch(
  () => route.path,
  () => {
    if (!screen.value) return
    screen.value.scrollTop = 0
    screen.value.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  },
  { flush: 'post' },
)

// Signed out while a screen is open (sign out, another tab, an expired
// session): leave for Sign in rather than wait for the next navigation
watch(
  () => auth.isSignedIn,
  (signedIn) => {
    if (!signedIn && !route.meta.guest) void router.replace({ name: 'sign-in' })
  },
)

// Focused directly: a plain #main jump would also go through the router
function skipToContent(): void {
  main.value?.focus()
}
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToContent">Skip to content</a>

  <div class="app">
    <!-- The screen scrolls; its main action (tab screens) stays below it, inside <main> -->
    <main id="main" ref="main" tabindex="-1" class="app__main">
      <div ref="screen" class="app__screen" :class="{ 'app__screen--tabs': route.meta.nav }">
        <RouterView />
      </div>
      <PageAction v-if="route.meta.nav" />
    </main>

    <BottomNav v-if="route.meta.nav" />
  </div>

  <!-- The one live region for status messages ("Saved"), see status.store -->
  <p class="visually-hidden" aria-live="polite" aria-atomic="true">{{ status.message }}</p>
</template>

<style scoped lang="scss">
.skip-link {
  position: fixed;
  top: $space-2;
  left: $space-2;
  z-index: 10;
  padding: $space-3 $space-5;
  border-radius: $radius-button;
  background: $color-card;
  color: $color-ink;
  box-shadow: $shadow-btn-light;
  text-decoration: none;
  @include type('button');

  &:not(:focus) {
    @include visually-hidden;
  }
}

// Full-height column like the prototype: the screen scrolls above, the nav stays below
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
}

.app__main {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
}

.app__screen {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
}

// Tab screens: padding and the soft fade above the page action, as in the prototype
.app__screen--tabs {
  padding: $space-page-top $space-4 $space-8;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent 100%);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent 100%);

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
