<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HighlightCard from '@/components/home/HighlightCard.vue'
import TrackerWeekCard from '@/components/home/TrackerWeekCard.vue'
import PebbleSmiling from '@/components/mascot/PebbleSmiling.vue'
import { TRACKER_ORDER } from '@/constants/trackers'
import { useEntriesStore } from '@/stores/entries.store'
import { longDate } from '@/utils/date'

const entries = useEntriesStore()
const isLoading = ref(true)

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
        <h1 tabindex="-1" class="home__title">Your week</h1>
      </div>
      <PebbleSmiling />
    </header>

    <HighlightCard :text="entries.todayEntry?.imp" />

    <div
      role="group"
      aria-label="Your trackers this week"
      class="home__trackers"
      :aria-busy="isLoading"
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
  @include type('title');
}

.home__trackers {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}
</style>
