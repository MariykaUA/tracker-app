<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from '@/components/base/GlassCard.vue'
import PeriodSwitcher from './PeriodSwitcher.vue'
import TrackerLegend from './TrackerLegend.vue'
import { TRACKERS } from '@/constants/trackers'
import { dayCell, monthGrid, type DayCell } from '@/utils/calendar'
import { dayOf, longDate, monthName, monthOf, yearOf } from '@/utils/date'
import type { DateKey, EntriesByDate, TrackerId } from '@/types/entry'

// One month of one tracker, Monday first. Earlier months of the year can be
// browsed; months still to come can't, as in the prototype. Tapping a day
// opens it in the one-day editor.
const props = defineProps<{
  trackerId: TrackerId
  year: number
  entries: EntriesByDate
  todayKey: DateKey
}>()

defineEmits<{ pick: [date: DateKey] }>()

const month = defineModel<number>('month', { required: true })

const WEEKDAY_LETTERS = 'MTWTFSS'.split('')

const name = computed(() => TRACKERS[props.trackerId].name)
const title = computed(() => `${monthName(month.value)} ${props.year}`)
const lastMonth = computed(() =>
  yearOf(props.todayKey) === props.year ? monthOf(props.todayKey) : 12,
)

const cells = computed<(DayCell | null)[]>(() =>
  monthGrid(props.year, month.value).map((date) =>
    date ? dayCell(props.trackerId, date, props.entries[date], props.todayKey, longDate) : null,
  ),
)
</script>

<template>
  <GlassCard :aria-label="`${name} in ${title}`">
    <PeriodSwitcher
      :title="title"
      previous-label="Previous month"
      next-label="Next month"
      :previous-disabled="month <= 1"
      :next-disabled="month >= lastMonth"
      @previous="month = Math.max(1, month - 1)"
      @next="month = Math.min(lastMonth, month + 1)"
    />

    <TrackerLegend :tracker-id="trackerId" />

    <div class="month-calendar__grid">
      <div class="month-calendar__weekdays" aria-hidden="true">
        <span v-for="(letter, index) in WEEKDAY_LETTERS" :key="index">{{ letter }}</span>
      </div>
      <div class="month-calendar__days">
        <template v-for="(cell, index) in cells" :key="cell?.date ?? `blank-${index}`">
          <button
            v-if="cell"
            type="button"
            class="month-calendar__day"
            :class="[`month-calendar__day--${cell.state}`, { 'is-today': cell.isToday }]"
            :style="cell.color ? { backgroundColor: cell.color, color: cell.ink } : undefined"
            :disabled="cell.state === 'future'"
            :aria-label="cell.label"
            :aria-current="cell.isToday ? 'date' : undefined"
            @click="$emit('pick', cell.date)"
          >
            {{ dayOf(cell.date) }}
          </button>
          <span v-else class="month-calendar__blank" aria-hidden="true"></span>
        </template>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped lang="scss">
$cell: $tap-target;

.month-calendar__grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.month-calendar__weekdays,
.month-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: $space-1;
}

.month-calendar__weekdays {
  color: $color-ink-soft;
  text-align: center;
  @include type('caption');
}

.month-calendar__blank {
  height: $cell;
}

.month-calendar__day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $cell;
  border: 2px solid $color-edge;
  border-radius: $radius-chip;
  color: $color-ink;
  @include type('label');
  @include cell-press;
}

.month-calendar__day--logged {
  border-color: transparent;
  box-shadow: $shadow-cell;

  &.is-today {
    box-shadow:
      $shadow-today,
      $shadow-cell;
  }
}

.month-calendar__day--empty.is-today {
  box-shadow: $shadow-today;
}

// Days still to come: dashed and muted
.month-calendar__day--future {
  border-style: dashed;
  color: $color-ink-muted;
}
</style>
