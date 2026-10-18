<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from '@/components/base/GlassCard.vue'
import { TRACKERS } from '@/constants/trackers'
import {
  CHART,
  dayCell,
  dotBottom,
  goalBottom,
  isBarTracker,
  weekColumn,
  weekScale,
} from '@/utils/calendar'
import { isLogged } from '@/utils/checkin'
import { longDate } from '@/utils/date'
import type { DateKey, TrackerId, WeekDay } from '@/types/entry'

// This week as a chart: bars for sleep and steps (with the goal line), level dots
// joined by a dotted line for mood, anxiety and crying. Every value is also text:
// over the bars, and in each day's label.
const props = defineProps<{
  trackerId: TrackerId
  days: WeekDay[] // Monday to Sunday
  todayKey: DateKey
  note: string // "Goal 8 h", "Higher is brighter"
}>()

// The prototype draws the chart 315px wide; it shrinks on narrower screens
const WIDTH = 315
const COLUMN = WIDTH / 7
const LETTERS = 'MTWTFSS'

const title = computed(() => TRACKERS[props.trackerId].weekTitle)
const isBars = computed(() => isBarTracker(props.trackerId))
const scale = computed(() =>
  weekScale(
    props.trackerId,
    props.days.map((day) => day.entry),
  ),
)

const columns = computed(() =>
  props.days.map(({ date, entry }, index) => ({
    cell: dayCell(props.trackerId, date, entry, props.todayKey, longDate),
    shape: weekColumn(props.trackerId, entry, scale.value),
    letter: LETTERS[index] ?? '',
  })),
)

// The dotted line through the level dots, in the chart's 315 × 196 box
const line = computed(() =>
  isBars.value
    ? ''
    : props.days
        .map(({ entry }, index) => {
          if (!entry || !isLogged(props.trackerId, entry)) return null
          const level = TRACKERS[props.trackerId].level(entry)
          const y = CHART.height - (dotBottom(props.trackerId, level) + CHART.dot / 2)
          return `${COLUMN / 2 + COLUMN * index},${y}`
        })
        .filter(Boolean)
        .join(' '),
)

const goal = computed(() => (isBars.value ? goalBottom(props.trackerId, scale.value) : null))
</script>

<template>
  <GlassCard :aria-label="title">
    <div class="week-bars__head">
      <h2 class="week-bars__title">{{ title }}</h2>
      <p class="week-bars__note">{{ note }}</p>
    </div>

    <div class="week-bars__chart">
      <div
        v-if="goal !== null"
        class="week-bars__goal"
        aria-hidden="true"
        :style="{ bottom: `${goal}px` }"
      ></div>
      <svg
        class="week-bars__line"
        aria-hidden="true"
        :viewBox="`0 0 ${WIDTH} ${CHART.height}`"
        preserveAspectRatio="none"
      >
        <polyline :points="line" />
      </svg>

      <div class="week-bars__columns">
        <span
          v-for="column in columns"
          :key="column.cell.date"
          role="img"
          class="week-bars__column"
          :aria-label="column.cell.label"
        >
          <span
            v-if="column.shape.value"
            class="week-bars__value"
            :style="{ bottom: `${column.shape.valueBottom}px` }"
          >
            {{ column.shape.value }}
          </span>
          <span
            class="week-bars__bar motion-grow"
            :class="{ 'week-bars__bar--logged': column.cell.color }"
            :style="{
              bottom: `${column.shape.bottom}px`,
              height: `${column.shape.height}px`,
              backgroundColor: column.cell.color,
            }"
          ></span>
          <span
            class="week-bars__letter"
            :class="{
              'is-today': column.cell.isToday,
              'is-future': column.cell.state === 'future',
            }"
          >
            {{ column.letter }}
          </span>
        </span>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped lang="scss">
$chart-height: 196px;

.week-bars__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: $space-3;
}

.week-bars__title {
  @include type('heading');
}

.week-bars__note {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.week-bars__chart {
  position: relative;
  align-self: center;
  width: 100%;
  max-width: 315px;
  height: $chart-height;
}

.week-bars__goal {
  position: absolute;
  right: 0;
  left: 0;
  border-top: 2px dashed $color-edge;
}

// Stretched to the chart's width; the stroke and dots keep their size
.week-bars__line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $chart-height;

  polyline {
    fill: none;
    stroke: $color-ink-soft;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1 7;
    vector-effect: non-scaling-stroke;
  }
}

.week-bars__columns {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.week-bars__column {
  position: relative;
  display: block;
  height: $chart-height;
  border-radius: $radius-icon;
}

.week-bars__value {
  position: absolute;
  right: 0;
  left: 0;
  color: $color-ink-soft;
  text-align: center;
  @include type('caption');
  letter-spacing: normal;
}

// Empty days are a short outline; logged ones take their level's colour
.week-bars__bar {
  position: absolute;
  left: 50%;
  width: 32px;
  margin-left: -16px;
  border: 2px solid $color-edge;
  border-radius: $radius-bar;
}

.week-bars__bar--logged {
  border-color: transparent;
  box-shadow: $shadow-cell;
}

.week-bars__letter {
  position: absolute;
  bottom: 0;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  border: 2px solid transparent;
  border-radius: $radius-pill;
  color: $color-ink-soft;
  @include type('caption');
  letter-spacing: normal;

  &.is-today {
    border-color: $color-ink-soft;
    color: $color-accent;
  }

  &.is-future {
    color: $color-ink-muted;
  }
}
</style>
