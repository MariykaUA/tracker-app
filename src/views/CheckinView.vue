<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import CheckinCard from '@/components/checkin/CheckinCard.vue'
import ProgressStepper from '@/components/layout/ProgressStepper.vue'
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

const entries = useEntriesStore()
const status = useStatusStore()
const router = useRouter()
const route = useRoute()
const card = useTemplateRef('card')

// Fixed when the check-in opens, so a check-in that runs past midnight
// still saves to the day it started on
const dateKey = entries.todayKey

const isReady = ref(false)
const step = ref(0)
const draft = ref<CheckinDraft>(draftFrom(undefined))

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
  await showStep(requestedStep() ?? firstGap(saved))
})

// ?step=2 opens on that question (a tracker page's "Log now"), if it's a real one
function requestedStep(): number | undefined {
  const step = Number(route.query.step)
  return Number.isInteger(step) && step >= 0 && step <= LAST_STEP ? step : undefined
}

// Each question is its own screen to screen readers: focus moves to its title
async function showStep(index: number): Promise<void> {
  step.value = index
  await card.value?.focusTitle()
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

      <CheckinCard ref="card" v-model:draft="draft" :step="step" />

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
// Fills the screen like the prototype; the card takes the space in between
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
