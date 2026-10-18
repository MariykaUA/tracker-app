<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from '@/components/base/GlassCard.vue'
import TrackerLegend from './TrackerLegend.vue'
import { TRACKERS } from '@/constants/trackers'
import { dayCell, yearRows, type DayCell } from '@/utils/calendar'
import { monthOf, shortDate, yearOf } from '@/utils/date'
import type { DateKey, EntriesByDate, TrackerId } from '@/types/entry'

// The year in pixels: a column per month, a row per day of the month.
// Each day is labelled like the prototype ("1 October: 7.5 hours, felt rested").
const props = defineProps<{
  trackerId: TrackerId
  year: number
  entries: EntriesByDate
  todayKey: DateKey
}>()

const MONTH_LETTERS = 'JFMAMJJASOND'.split('')
const DAY_NUMBERS = Array.from({ length: 31 }, (_, i) => i + 1)

const name = computed(() => TRACKERS[props.trackerId].name)
// Its letter is darker in the year it's in
const currentMonth = computed(() =>
  yearOf(props.todayKey) === props.year ? monthOf(props.todayKey) : 0,
)

const cells = computed<(DayCell | null)[]>(() =>
  yearRows(props.year).map((date) =>
    date
      ? dayCell(props.trackerId, date, props.entries[date], props.todayKey, shortDate)
      : null,
  ),
)
</script>

<template>
  <GlassCard :aria-label="`${name} calendar for ${year}`">
    <div class="year-grid__head">
      <h2 class="year-grid__title">{{ name }} calendar</h2>
      <p class="year-grid__year">{{ year }}</p>
    </div>

    <TrackerLegend :tracker-id="trackerId" />

    <div class="year-grid__tray">
      <div v-for="edge in ['top', 'bottom']" :key="edge" :class="`year-grid__months year-grid__months--${edge}`" aria-hidden="true">
        <span
          v-for="(letter, index) in MONTH_LETTERS"
          :key="index"
          :class="{ 'is-current': index + 1 === currentMonth }"
        >
          {{ letter }}
        </span>
      </div>

      <div class="year-grid__body">
        <div class="year-grid__days" aria-hidden="true">
          <span v-for="day in DAY_NUMBERS" :key="day">{{ day }}</span>
        </div>
        <div class="year-grid__cells">
          <template v-for="(cell, index) in cells" :key="index">
            <span
              v-if="cell"
              role="img"
              class="year-grid__cell"
              :class="[`year-grid__cell--${cell.state}`, { 'is-today': cell.isToday }]"
              :style="cell.color ? { backgroundColor: cell.color } : undefined"
              :aria-label="cell.label"
              :title="cell.label"
            ></span>
            <span v-else class="year-grid__cell year-grid__cell--none" aria-hidden="true"></span>
          </template>
        </div>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped lang="scss">
$day-column: 18px;
$row: 20px;

.year-grid__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.year-grid__title {
  @include type('heading');
}

.year-grid__year {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.year-grid__tray {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: $space-2;
  border-radius: $radius-icon;
  background: $color-sunken;
  box-shadow: $shadow-pressed;
}

// The month letters above and below, lined up with the columns
.year-grid__months {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 3px;
  margin-left: $day-column + 6px;
  color: $color-ink-soft;
  text-align: center;
  @include type('caption');

  .is-current {
    color: $color-ink;
  }
}

// Bottom letters come after the grid
.year-grid__months--bottom {
  order: 1;
}

.year-grid__body {
  display: flex;
  gap: 6px;
}

.year-grid__days {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 3px;
  width: $day-column;
  color: $color-ink-soft;
  text-align: right;
  @include type('caption');
  letter-spacing: normal;
  line-height: $row;
}

.year-grid__cells {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 3px;
}

.year-grid__cell {
  display: block;
  height: $row;
  border: 2px solid $color-edge;
  border-radius: $radius-cell;
}

.year-grid__cell--logged {
  border-color: transparent;
  box-shadow: $shadow-cell;

  &.is-today {
    box-shadow:
      $shadow-today,
      $shadow-cell;
  }
}

.year-grid__cell--empty.is-today {
  box-shadow: $shadow-today;
}

.year-grid__cell--future {
  opacity: 0.4;
}

// 31 February and friends keep their place but aren't drawn
.year-grid__cell--none {
  visibility: hidden;
}
</style>
