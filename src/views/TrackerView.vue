<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MonthCalendar from '@/components/calendar/MonthCalendar.vue'
import MoodNotes from '@/components/calendar/MoodNotes.vue'
import RangeTabs from '@/components/calendar/RangeTabs.vue'
import SummaryCards from '@/components/calendar/SummaryCards.vue'
import WeekBars from '@/components/calendar/WeekBars.vue'
import YearGrid from '@/components/calendar/YearGrid.vue'
import { TRACKER_ICONS } from '@/constants/icons'
import { TRACKERS } from '@/constants/trackers'
import { editDay } from '@/router/links'
import { useEntriesStore } from '@/stores/entries.store'
import { dateKeyOf, dateRange, daysInMonth, monthName, monthOf, yearOf } from '@/utils/date'
import { summarize } from '@/utils/stats'
import type { RangeView } from '@/types/calendar'
import type { DateKey, TrackerId, WeekDay } from '@/types/entry'

// One view for all five trackers: Calendar (the year), Month and Week
const props = defineProps<{ trackerId: TrackerId }>()

const entries = useEntriesStore()
const router = useRouter()

const isLoading = ref(true)
const view = ref<RangeView>('year')

const tracker = computed(() => TRACKERS[props.trackerId])
const year = computed(() => entries.selectedYear)
const isThisYear = computed(() => year.value === yearOf(entries.todayKey))
const thisMonth = computed(() => monthOf(entries.todayKey))

// The month view opens on this month, or on December of an earlier year
const month = ref(isThisYear.value ? thisMonth.value : 12)

// The days of the month on screen up to today, for its summary and notes
const monthDays = computed<WeekDay[]>(() =>
  Array.from({ length: daysInMonth(year.value, month.value) }, (_, i) =>
    dateKeyOf(year.value, month.value, i + 1),
  )
    .filter((date) => date <= entries.todayKey)
    .map((date) => ({ date, entry: entries.entries[date] })),
)

const spanDays = computed(() => (view.value === 'month' ? monthDays.value : entries.weekEntries))
const summary = computed(() =>
  summarize(
    props.trackerId,
    spanDays.value.map((day) => day.entry),
  ),
)

// The line over the title, as in the prototype
const caption = computed(() => {
  if (view.value === 'year') return `${year.value} so far`
  if (view.value === 'month') {
    return isThisYear.value && month.value === thisMonth.value ? 'This month so far' : 'Looking back'
  }
  const week = entries.weekEntries
  return `This week · ${dateRange(week[0]?.date ?? '', week[6]?.date ?? '')}`
})

const showNotes = computed(() => props.trackerId === 'mood' && view.value !== 'year')
const notesCaption = computed(() =>
  view.value === 'month' ? monthName(month.value) : 'This week',
)
const notesEmpty = computed(
  () =>
    `No notes ${view.value === 'month' ? `in ${monthName(month.value)}` : 'this week'}. Add one when you log your mood.`,
)

// Any day on the page (a cell, a week bar, a mood note) opens this tracker's
// question for that day in the one-day editor
function openDay(date: DateKey): void {
  void router.push(editDay(date, tracker.value.step))
}

// The year on screen and this week (which can reach into last year)
onMounted(async () => {
  try {
    await Promise.all([entries.fetchYear(year.value), entries.fetchWeek()])
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="tracker motion-rise" :aria-busy="isLoading">
    <header class="tracker__header">
      <div class="tracker__titles">
        <p class="tracker__caption">{{ caption }}</p>
        <h1 tabindex="-1" class="tracker__title">{{ tracker.name }}</h1>
      </div>
      <img
        class="tracker__icon motion-bob"
        :src="TRACKER_ICONS[trackerId]"
        alt=""
        width="80"
        height="80"
      />
    </header>

    <RangeTabs v-model="view" />

    <YearGrid
      v-if="view === 'year'"
      :tracker-id="trackerId"
      :year="year"
      :entries="entries.entries"
      :today-key="entries.todayKey"
      @pick="openDay"
    />

    <div v-else class="tracker__range">
      <MonthCalendar
        v-if="view === 'month'"
        v-model:month="month"
        :tracker-id="trackerId"
        :year="year"
        :entries="entries.entries"
        :today-key="entries.todayKey"
        @pick="openDay"
      />
      <WeekBars
        v-else
        :tracker-id="trackerId"
        :days="entries.weekEntries"
        :today-key="entries.todayKey"
        :note="summary.weekNote"
        @pick="openDay"
      />
      <SummaryCards :summary="summary" />
    </div>

    <MoodNotes
      v-if="showNotes"
      :days="spanDays"
      :caption="notesCaption"
      :empty-text="notesEmpty"
      @pick="openDay"
    />
  </div>
</template>

<style scoped lang="scss">
.tracker {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.tracker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: 0 $space-1;
}

.tracker__titles {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.tracker__caption {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.tracker__title {
  @include type('title');
}

.tracker__icon {
  flex: none;
  width: 80px;
  height: 80px;
  margin: -8px;
  object-fit: contain;
}

.tracker__range {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}
</style>
