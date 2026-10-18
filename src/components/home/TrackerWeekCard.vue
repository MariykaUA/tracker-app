<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { TRACKER_ICONS } from '@/constants/icons'
import { TRACKERS } from '@/constants/trackers'
import { isLogged } from '@/utils/checkin'
import { summaryValue } from '@/utils/stats'
import type { DateKey, TrackerId, WeekDay } from '@/types/entry'

interface Dot {
  date: DateKey
  letter: string
  color: string | undefined // the level's colour when logged
  isToday: boolean
  isFuture: boolean
}

// One tracker on Home: its name, this week's summary and a dot per day, Monday first.
// The dots are decoration for sighted users; the summary is what the link says.
const props = defineProps<{
  trackerId: TrackerId
  days: WeekDay[] // Monday to Sunday
  todayKey: DateKey
}>()

const LETTERS = 'MTWTFSS'

const tracker = computed(() => TRACKERS[props.trackerId])
const value = computed(() =>
  summaryValue(
    props.trackerId,
    props.days.map((day) => day.entry),
  ),
)

const dots = computed<Dot[]>(() =>
  props.days.map(({ date, entry }, index) => ({
    date,
    letter: LETTERS[index] ?? '',
    color:
      entry && isLogged(props.trackerId, entry)
        ? tracker.value.colors[tracker.value.level(entry) - 1]
        : undefined,
    isToday: date === props.todayKey,
    isFuture: date > props.todayKey,
  })),
)
</script>

<template>
  <RouterLink :to="{ name: 'tracker', params: { id: trackerId } }" class="tracker-week-card">
    <span class="tracker-week-card__head">
      <img class="tracker-week-card__icon" :src="TRACKER_ICONS[trackerId]" alt="" width="64" height="64" />
      <span class="tracker-week-card__text">
        <!-- The space keeps name and value apart in the link's spoken name -->
        <span class="tracker-week-card__name">{{ tracker.name }}&nbsp;</span>
        <span class="tracker-week-card__value">{{ value }}</span>
      </span>
      <svg class="tracker-week-card__chevron" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </span>
    <span class="tracker-week-card__week" aria-hidden="true">
      <span v-for="dot in dots" :key="dot.date" class="tracker-week-card__day">
        <span
          class="tracker-week-card__dot"
          :class="{
            'tracker-week-card__dot--logged': dot.color,
            'tracker-week-card__dot--future': dot.isFuture,
          }"
          :style="dot.color ? { backgroundColor: dot.color } : undefined"
        ></span>
        <span
          class="tracker-week-card__letter"
          :class="{ 'tracker-week-card__letter--today': dot.isToday }"
        >
          {{ dot.letter }}
        </span>
      </span>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.tracker-week-card {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  width: 100%;
  padding: $space-4;
  border: $border-card;
  border-radius: $radius-card;
  background: $color-card;
  box-shadow: $shadow-card;
  color: $color-ink;
  text-decoration: none;
  @include press;
  @include glass;
}

.tracker-week-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tracker-week-card__icon {
  flex: none;
  width: 64px;
  height: 64px;
  margin: -6px;
  object-fit: contain;
}

.tracker-week-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.tracker-week-card__name {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.tracker-week-card__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @include type('stat');
}

.tracker-week-card__chevron {
  flex: none;
  fill: none;
  stroke: $color-ink-soft;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tracker-week-card__week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.tracker-week-card__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
}

// Empty days are outlined; logged days are filled with their level's colour
.tracker-week-card__dot {
  display: block;
  width: 100%;
  height: 26px;
  border: 2px solid $color-edge;
  border-radius: $radius-dot;
}

.tracker-week-card__dot--logged {
  border-color: transparent;
  box-shadow: $shadow-cell;
}

.tracker-week-card__dot--future {
  opacity: 0.45;
}

.tracker-week-card__letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-radius: $radius-pill;
  color: $color-ink-soft;
  @include type('caption');
  letter-spacing: normal;
}

// Today: pink letter in an ink ring
.tracker-week-card__letter--today {
  border-color: $color-ink-soft;
  color: $color-accent;
}
</style>
