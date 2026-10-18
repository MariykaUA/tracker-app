<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import { isTrackerId, TRACKERS } from '@/constants/trackers'
import { checkinAt, editDay } from '@/router/links'
import { buzz, TAP } from '@/services/haptics.service'
import { useEntriesStore } from '@/stores/entries.store'
import { isComplete, isLogged, LAST_STEP } from '@/utils/checkin'
import { yearOf } from '@/utils/date'

const route = useRoute()
const entries = useEntriesStore()

// The big button above the nav on the tab screens, as in the prototype:
// - Today: the check-in ("Check in" / "Edit today")
// - a tracker page: "Log now" starts the check-in at its question; once today
//   is logged, "Edit today" opens that question in the one-day editor
// - One thing: today's one thing in the one-day editor
// Opening the editor gives the prototype's tap of vibration; the check-in doesn't.
// It's the screen's own action, so App.vue keeps it inside <main>.
const action = computed<{ label: string; to: RouteLocationRaw; buzz: boolean } | null>(() => {
  const today = entries.todayEntry

  if (route.name === 'home') {
    return {
      label: isComplete(today) ? 'Edit today' : 'Check in',
      to: { name: 'checkin' },
      buzz: false,
    }
  }

  const id = route.params.id
  if (route.name === 'tracker' && isTrackerId(id)) {
    const step = TRACKERS[id].step
    return isLogged(id, today)
      ? { label: 'Edit today', to: editDay(entries.todayKey, step), buzz: true }
      : { label: 'Log now', to: checkinAt(step), buzz: false }
  }

  if (route.name === 'one-thing') {
    return {
      label: today?.imp ? 'Edit today' : 'Write it down',
      to: editDay(entries.todayKey, LAST_STEP),
      buzz: true,
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
  <div v-if="action" class="page-action">
    <BaseButton :to="action.to" class="page-action__button" @click="action.buzz && buzz(TAP)">
      <span>{{ action.label }}</span>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6l-6 6" />
      </svg>
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.page-action {
  display: flex;
  padding: 0 $space-4 14px;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.page-action__button {
  flex: 1;
}
</style>
