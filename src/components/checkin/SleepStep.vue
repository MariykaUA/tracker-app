<script setup lang="ts">
import { computed } from 'vue'
import CheckinQuestion from './CheckinQuestion.vue'
import RangeSlider from '@/components/base/RangeSlider.vue'
import { RESTED_LABELS } from '@/constants/trackers'
import { formatHours } from '@/utils/format'
import type { Rested } from '@/types/entry'

// Check-in 1: hours slept and how rested
const hours = defineModel<number>('hours', { required: true })
const rested = defineModel<Rested>('rested', { required: true })

const hoursText = computed(() => formatHours(hours.value))
const restedWord = computed(() => RESTED_LABELS[rested.value - 1] ?? '')

// The slider gives numbers; rested is always a whole step from 1 to 5
const restedLevel = computed({
  get: () => rested.value,
  set: (value: number) => {
    rested.value = Math.max(1, Math.min(5, Math.round(value))) as Rested
  },
})
</script>

<template>
  <CheckinQuestion title="How was dreamland?">
    <div class="sleep-step">
      <RangeSlider
        v-model="hours"
        label="Hours slept"
        layout="stacked"
        :min="0"
        :max="12"
        :step="0.5"
        :value-text="`${hoursText} hours`"
        :ticks="['0', '6', '12']"
        inset-ticks
      >
        <div class="sleep-step__hours">
          {{ hoursText }} <span class="sleep-step__unit">h</span>
        </div>
      </RangeSlider>
      <RangeSlider
        v-model="restedLevel"
        label="How rested do you feel?"
        :min="1"
        :max="5"
        :value-text="restedWord"
        :ticks="[RESTED_LABELS[0], RESTED_LABELS[4]]"
      >
        <span class="sleep-step__rested">{{ restedWord }}</span>
      </RangeSlider>
    </div>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
.sleep-step {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.sleep-step__hours {
  @include type('numeral');
}

.sleep-step__unit {
  color: $color-ink-soft;
  font-size: 1.5rem;
}

.sleep-step__rested {
  @include type('button');
}
</style>
