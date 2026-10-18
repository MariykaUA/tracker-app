<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import { isTrackerId, TRACKERS } from '@/constants/trackers'
import { useEntriesStore } from '@/stores/entries.store'
import { isComplete, isLogged, LAST_STEP } from '@/utils/checkin'
import { yearOf } from '@/utils/date'

const route = useRoute()
const entries = useEntriesStore()

// The big button above the nav, as in the prototype. On Today it opens the
// check-in; on a tracker page or One thing, the check-in at that question.
const cta = computed<{ label: string; to: RouteLocationRaw } | null>(() => {
  const today = entries.todayEntry

  if (route.name === 'home') {
    return { label: isComplete(today) ? 'Edit today' : 'Check in', to: { name: 'checkin' } }
  }

  const id = route.params.id
  if (route.name === 'tracker' && isTrackerId(id)) {
    return {
      label: isLogged(id, today) ? 'Edit today' : 'Log now',
      to: { name: 'checkin', query: { step: TRACKERS[id].step } },
    }
  }

  if (route.name === 'one-thing') {
    return {
      label: today?.imp ? 'Edit today' : 'Write it down',
      to: { name: 'checkin', query: { step: LAST_STEP } },
    }
  }

  return null
})

// Today's entry decides the label
onMounted(() => {
  entries.fetchYear(yearOf(entries.todayKey)).catch((error: unknown) => console.error(error))
})
</script>

<template>
  <div class="bottom-nav">
    <div v-if="cta" class="bottom-nav__cta">
      <BaseButton :to="cta.to" class="bottom-nav__cta-button">
        <span>{{ cta.label }}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6l-6 6" />
        </svg>
      </BaseButton>
    </div>
    <nav class="bottom-nav__panel" aria-label="Main">
      <!-- RouterLink sets aria-current="page" on the active link -->
      <RouterLink to="/" class="bottom-nav__link" exact-active-class="is-active">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
          <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z" />
        </svg>
        <span>Today</span>
      </RouterLink>
      <RouterLink to="/one-thing" class="bottom-nav__link" exact-active-class="is-active">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 3.8l2.5 5.1l5.6.8l-4 3.9l1 5.6L12 16.6l-5.1 2.6l1-5.6l-4-3.9l5.6-.8z" />
        </svg>
        <span>One thing</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: relative;
  padding: 0 $space-4 28px;
}

.bottom-nav__cta {
  display: flex;
  padding-bottom: 14px;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.bottom-nav__cta-button {
  flex: 1;
}

.bottom-nav__panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  padding: 6px 6px 9px;
  border: $border-card;
  border-radius: $radius-panel;
  background: $color-card;
  box-shadow: $shadow-nav;
  @include glass;
}

.bottom-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  height: 52px;
  padding: 0 $space-3;
  border-radius: $radius-button;
  color: $color-ink-soft;
  text-decoration: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform $duration-press ease,
    box-shadow $duration-press ease,
    filter $duration-fast ease;
  @include type('card-label');

  svg {
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(3px);
  }

  &.is-active {
    background: $color-bg;
    color: $color-ink;
    box-shadow: $shadow-btn-tab;

    svg {
      fill: $color-nav-icon;
    }

    &:active {
      transform: translateY(2px);
      box-shadow: $shadow-btn-tab-active;
    }
  }
}
</style>
