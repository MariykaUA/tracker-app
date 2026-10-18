<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EarlierDays from '@/components/one-thing/EarlierDays.vue'
import TodayCard from '@/components/one-thing/TodayCard.vue'
import oneThingIcon from '@/assets/icons/icon-one-thing.png'
import { editDay } from '@/router/links'
import { buzz, TAP } from '@/services/haptics.service'
import { useEntriesStore } from '@/stores/entries.store'
import { LAST_STEP } from '@/utils/checkin'
import { daysBefore, longDate, yearOf } from '@/utils/date'
import type { DateKey, WeekDay } from '@/types/entry'

const EARLIER_DAYS = 7

const entries = useEntriesStore()
const router = useRouter()
const isLoading = ref(true)

// Today's card and every earlier day open that day's one thing in the
// one-day editor, as in the prototype
const writeToday = computed(() => editDay(entries.todayKey, LAST_STEP))

function openDay(date: DateKey): void {
  buzz(TAP)
  void router.push(editDay(date, LAST_STEP))
}

const earlier = computed<WeekDay[]>(() =>
  daysBefore(entries.todayKey, EARLIER_DAYS).map((date) => ({
    date,
    entry: entries.entriesByYear[yearOf(date)]?.[date],
  })),
)

// The last seven days can start in last year
onMounted(async () => {
  const years = new Set([entries.todayKey, ...earlier.value.map((day) => day.date)].map(yearOf))
  try {
    await Promise.all([...years].map((year) => entries.fetchYear(year)))
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="one-thing motion-rise" :aria-busy="isLoading || entries.isLoading">
    <header class="one-thing__header">
      <div class="one-thing__titles">
        <p class="one-thing__date">{{ longDate(entries.todayKey) }}</p>
        <h1 tabindex="-1" class="one-thing__title">One thing of today</h1>
      </div>
      <img class="one-thing__icon motion-bob" :src="oneThingIcon" alt="" width="72" height="72" />
    </header>

    <TodayCard :text="entries.todayEntry?.imp" :to="writeToday" />

    <EarlierDays :days="earlier" :yesterday-key="earlier[0]?.date ?? ''" @pick="openDay" />
  </div>
</template>

<style scoped lang="scss">
.one-thing {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.one-thing__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: 0 $space-1;
}

.one-thing__titles {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.one-thing__date {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.one-thing__title {
  @include type('title');
}

.one-thing__icon {
  flex: none;
  width: 72px;
  height: 72px;
  margin: -6px;
  object-fit: contain;
}
</style>
