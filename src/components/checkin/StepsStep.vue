<script setup lang="ts">
import { computed } from 'vue'
import CheckinQuestion from './CheckinQuestion.vue'
import NumberStepper from '@/components/base/NumberStepper.vue'
import { STEP_GOAL } from '@/constants/goals'
import { formatNumber } from '@/utils/format'

// Check-in 2: steps walked, with a ring filling up towards the goal
const steps = defineModel<string>({ required: true })

const RING = 439.8 // circumference of the ring, r = 70

const count = computed(() => Number.parseInt(steps.value || '0', 10) || 0)
const ringOffset = computed(() => (RING * (1 - Math.min(count.value / STEP_GOAL, 1))).toFixed(1))
</script>

<template>
  <CheckinQuestion title="Feet report, please!">
    <div class="steps-step">
      <div class="steps-step__ring">
        <svg aria-hidden="true" width="168" height="168" viewBox="0 0 168 168">
          <circle class="steps-step__ring-track" cx="84" cy="84" r="70" />
          <circle
            class="steps-step__ring-fill"
            cx="84"
            cy="84"
            r="70"
            transform="rotate(-90 84 84)"
            :stroke-dasharray="RING"
            :stroke-dashoffset="ringOffset"
          />
        </svg>
        <div class="steps-step__count">
          <div class="steps-step__number">{{ formatNumber(count) }}</div>
          <div class="steps-step__goal">of {{ formatNumber(STEP_GOAL) }}</div>
        </div>
      </div>
      <NumberStepper
        v-model="steps"
        label="Steps walked"
        decrease-label="500 fewer steps"
        increase-label="500 more steps"
        :step="500"
        :max="99999"
      />
    </div>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
$ring: 168px;

.steps-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-5;
}

.steps-step__ring {
  position: relative;
  width: $ring;
  height: $ring;
}

.steps-step__ring-track,
.steps-step__ring-fill {
  fill: none;
  stroke-width: 14;
}

.steps-step__ring-track {
  stroke: $color-edge;
  opacity: 0.4;
}

.steps-step__ring-fill {
  stroke: $color-fill;
  stroke-linecap: round;
  transition: stroke-dashoffset 600ms $ease-bounce;
}

.steps-step__count {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.steps-step__number {
  @include type('title-lg');
}

.steps-step__goal {
  color: $color-ink-soft;
  @include type('eyebrow');
}
</style>
