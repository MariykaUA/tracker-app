<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HighlightCard from '@/components/home/HighlightCard.vue'
import TrackerWeekCard from '@/components/home/TrackerWeekCard.vue'
import PebbleSmiling from '@/components/mascot/PebbleSmiling.vue'
import { TRACKER_ORDER } from '@/constants/trackers'
import { editDay } from '@/router/links'
import { useAuthStore } from '@/stores/auth.store'
import { useEntriesStore } from '@/stores/entries.store'
import { LAST_STEP } from '@/utils/checkin'
import { longDate } from '@/utils/date'

const auth = useAuthStore()
const entries = useEntriesStore()
const isLoading = ref(true)

// The highlight opens today's one thing in the one-day editor, as in the prototype
const editHighlight = computed(() => editDay(entries.todayKey, LAST_STEP))

// This week can start in last year, so the store loads every year it touches
onMounted(async () => {
  try {
    await entries.fetchWeek()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="home motion-rise">
    <header class="home__header">
      <div class="home__titles">
        <p class="home__date">{{ longDate(entries.todayKey) }}</p>
        <!-- The account's name follows the title: "Your week, Mariia" -->
        <h1 tabindex="-1" class="home__title">
          Your week<template v-if="auth.name">, {{ auth.name }}</template>
        </h1>
      </div>
      <PebbleSmiling />
    </header>

    <HighlightCard :text="entries.todayEntry?.imp" :to="editHighlight" />

    <div
      role="group"
      aria-label="Your trackers this week"
      class="home__trackers"
      :aria-busy="isLoading || entries.isLoading"
    >
      <TrackerWeekCard
        v-for="trackerId in TRACKER_ORDER"
        :key="trackerId"
        :tracker-id="trackerId"
        :days="entries.weekEntries"
        :today-key="entries.todayKey"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.home__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: 0 $space-1;
}

.home__titles {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.home__date {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.home__title {
  overflow-wrap: anywhere; // a long name wraps instead of widening the header
  @include type('title');
}

.home__trackers {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}
</style>
