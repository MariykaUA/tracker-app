<script setup lang="ts">
import { computed, nextTick, useTemplateRef, type Component } from 'vue'
import AnxietyStep from './AnxietyStep.vue'
import CryingStep from './CryingStep.vue'
import MoodStep from './MoodStep.vue'
import OneThingStep from './OneThingStep.vue'
import SleepStep from './SleepStep.vue'
import StepsStep from './StepsStep.vue'
import PebbleCalm from '@/components/mascot/PebbleCalm.vue'
import PebbleCheerful from '@/components/mascot/PebbleCheerful.vue'
import PebbleSleeping from '@/components/mascot/PebbleSleeping.vue'
import PebbleStar from '@/components/mascot/PebbleStar.vue'
import PebbleTearful from '@/components/mascot/PebbleTearful.vue'
import PebbleWalking from '@/components/mascot/PebbleWalking.vue'
import { ONE_THING_DISC, TRACKER_ORDER, TRACKERS } from '@/constants/trackers'
import type { CheckinDraft } from '@/types/checkin'

// The check-in's big card: Pebble on the question's coloured disc, then the
// question itself. The daily check-in and the one-day editor both use it.
const props = defineProps<{ step: number }>()

const draft = defineModel<CheckinDraft>('draft', { required: true })

// Pebble's pose for each question, in check-in order
const POSES: Component[] = [
  PebbleSleeping,
  PebbleWalking,
  PebbleCheerful,
  PebbleCalm,
  PebbleTearful,
  PebbleStar,
]

const card = useTemplateRef<HTMLElement>('card')

const disc = computed(() => {
  const tracker = TRACKER_ORDER[props.step]
  return tracker ? TRACKERS[tracker].disc : ONE_THING_DISC
})

// Each question is its own screen to screen readers: the view moves focus to its title
async function focusTitle(): Promise<void> {
  await nextTick()
  card.value?.querySelector<HTMLElement>('h1')?.focus()
}

defineExpose({ focusTitle })
</script>

<template>
  <div ref="card" class="checkin-card">
    <div class="checkin-card__illustration" :style="{ backgroundColor: disc }">
      <component :is="POSES[step]" :key="step" />
    </div>

    <SleepStep v-if="step === 0" v-model:hours="draft.hours" v-model:rested="draft.rested" />
    <StepsStep v-else-if="step === 1" v-model="draft.steps" />
    <MoodStep v-else-if="step === 2" v-model="draft.mood" />
    <AnxietyStep v-else-if="step === 3" v-model="draft.anx" />
    <CryingStep v-else-if="step === 4" v-model="draft.cry" />
    <OneThingStep v-else v-model="draft.imp" />
  </div>
</template>

<style scoped lang="scss">
// Grows instead of shrinking on short screens or with large text, so the page
// scrolls and nothing is cut off
.checkin-card {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  gap: $space-4;
  padding: $space-5;
  border: $border-card;
  border-radius: $radius-card;
  background: $color-card;
  box-shadow: $shadow-sheet;
  @include glass;
}

.checkin-card__illustration {
  display: flex;
  flex: none;
  align-self: center;
  align-items: flex-end;
  justify-content: center;
  width: 176px;
  height: 112px;
  border-radius: $radius-card;
  overflow: hidden;
  transition: background-color $duration-fade ease;
}
</style>
