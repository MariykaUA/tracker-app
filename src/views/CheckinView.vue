<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, type Component } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import AnxietyStep from '@/components/checkin/AnxietyStep.vue'
import CryingStep from '@/components/checkin/CryingStep.vue'
import MoodStep from '@/components/checkin/MoodStep.vue'
import OneThingStep from '@/components/checkin/OneThingStep.vue'
import SleepStep from '@/components/checkin/SleepStep.vue'
import StepsStep from '@/components/checkin/StepsStep.vue'
import ProgressStepper from '@/components/layout/ProgressStepper.vue'
import PebbleCalm from '@/components/mascot/PebbleCalm.vue'
import PebbleCheerful from '@/components/mascot/PebbleCheerful.vue'
import PebbleSleeping from '@/components/mascot/PebbleSleeping.vue'
import PebbleStar from '@/components/mascot/PebbleStar.vue'
import PebbleTearful from '@/components/mascot/PebbleTearful.vue'
import PebbleWalking from '@/components/mascot/PebbleWalking.vue'
import { ONE_THING_DISC, TRACKER_ORDER, TRACKERS } from '@/constants/trackers'
import { useEntriesStore } from '@/stores/entries.store'
import { useStatusStore } from '@/stores/status.store'
import {
  CHECKIN_STEPS,
  LAST_STEP,
  canContinue,
  draftFrom,
  firstGap,
  stepValues,
} from '@/utils/checkin'
import { longDate, yearOf } from '@/utils/date'
import type { CheckinDraft } from '@/types/checkin'
import type { DayValues } from '@/types/entry'

// Pebble's pose for each question, in check-in order
const POSES: Component[] = [
  PebbleSleeping,
  PebbleWalking,
  PebbleCheerful,
  PebbleCalm,
  PebbleTearful,
  PebbleStar,
]

const entries = useEntriesStore()
const status = useStatusStore()
const router = useRouter()
const card = useTemplateRef<HTMLElement>('card')

// Fixed when the check-in opens, so a check-in that runs past midnight
// still saves to the day it started on
const dateKey = entries.todayKey

const isReady = ref(false)
const step = ref(0)
const draft = ref<CheckinDraft>(draftFrom(undefined))

const disc = computed(() => {
  const tracker = TRACKER_ORDER[step.value]
  return tracker ? TRACKERS[tracker].disc : ONE_THING_DISC
})
const canGoOn = computed(() => canContinue(step.value, draft.value))

// Today's entry may not be loaded yet when the check-in is opened directly
onMounted(async () => {
  try {
    await entries.fetchYear(yearOf(dateKey))
  } catch (error) {
    console.error(error)
  }

  const saved = entries.entriesByYear[yearOf(dateKey)]?.[dateKey]
  draft.value = draftFrom(saved)
  isReady.value = true
  await showStep(firstGap(saved))
})

// Each question is its own screen to screen readers: focus moves to its title
async function showStep(index: number): Promise<void> {
  step.value = index
  await nextTick()
  card.value?.querySelector<HTMLElement>('h1')?.focus()
}

// The cache updates at once, so the UI doesn't wait for the server
function save(values: Partial<DayValues>): void {
  entries.save(dateKey, values).catch((error: unknown) => {
    console.error(error)
    void status.announce("Couldn't save")
  })
}

function next(): void {
  save(stepValues(step.value, draft.value))
  if (step.value < LAST_STEP) void showStep(step.value + 1)
  // Replaced, so Back from Done doesn't reopen the last question
  else void router.replace({ name: 'done' })
}

// Back steps through the questions; from the first one it leaves the check-in
function back(): void {
  if (step.value > 0) void showStep(step.value - 1)
  else if (router.options.history.state.back) router.back()
  else void router.replace({ name: 'home' })
}
</script>

<template>
  <div class="checkin" :aria-busy="!isReady">
    <template v-if="isReady">
      <div class="checkin__header">
        <ProgressStepper :current="step" :total="CHECKIN_STEPS" />
      </div>
      <p class="checkin__caption">{{ longDate(dateKey) }}</p>

      <div ref="card" class="checkin__card">
        <div class="checkin__illustration" :style="{ backgroundColor: disc }">
          <component :is="POSES[step]" :key="step" />
        </div>

        <SleepStep
          v-if="step === 0"
          v-model:hours="draft.hours"
          v-model:rested="draft.rested"
        />
        <StepsStep v-else-if="step === 1" v-model="draft.steps" />
        <MoodStep v-else-if="step === 2" v-model="draft.mood" />
        <AnxietyStep v-else-if="step === 3" v-model="draft.anx" />
        <CryingStep v-else-if="step === 4" v-model="draft.cry" />
        <OneThingStep v-else v-model="draft.imp" />
      </div>

      <div class="checkin__actions">
        <BaseButton variant="light" class="checkin__back" @click="back">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path d="M15 6l-6 6l6 6" />
          </svg>
          <span>Back</span>
        </BaseButton>
        <BaseButton class="checkin__next" :disabled="!canGoOn" @click="next">
          <span>{{ step === LAST_STEP ? 'Done' : 'Next' }}</span>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6l-6 6" />
          </svg>
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
// Fills the screen like the prototype; on short screens or with large text
// the card grows instead and the page scrolls, so nothing is cut off
.checkin {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  min-height: 100%;
  padding: $space-page-top $space-4 34px;
}

.checkin__header {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.checkin__caption {
  color: $color-ink-soft;
  text-align: center;
  @include type('eyebrow');
}

.checkin__card {
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

.checkin__illustration {
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

.checkin__actions {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding-top: $space-1;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  // Nested, so these win over BaseButton's own padding
  .checkin__back {
    gap: 6px;
    padding: 0 $space-5 0 14px;
  }

  .checkin__next {
    flex: 1;
  }
}
</style>
