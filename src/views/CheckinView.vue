<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import CheckinCard from '@/components/checkin/CheckinCard.vue'
import DaySwitcher from '@/components/checkin/DaySwitcher.vue'
import ProgressStepper from '@/components/layout/ProgressStepper.vue'
import { useEntriesStore } from '@/stores/entries.store'
import { useStatusStore } from '@/stores/status.store'
import {
  CHECKIN_STEPS,
  LAST_STEP,
  canContinue,
  draftFrom,
  firstGap,
  hasAnswer,
  stepValues,
} from '@/utils/checkin'
import { dateKeyOf, dayOf, longDate, monthOf, parseDateKey, yearOf } from '@/utils/date'
import type { CheckinDraft } from '@/types/checkin'
import type { DateKey, DayValues } from '@/types/entry'

// Two modes, as in the prototype:
// - the daily check-in (/checkin): today's six questions, Next to Done
// - the one-day editor (/checkin?date=…&step=…): one question for one day, with Save
const entries = useEntriesStore()
const status = useStatusStore()
const router = useRouter()
const route = useRoute()
const card = useTemplateRef('card')

// Fixed when the screen opens, so a check-in that runs past midnight still
// saves to the day it started on
const today = entries.todayKey
const isEditor = route.query.date !== undefined
// The editor reaches back to 1 January of this year, like the prototype, and never
// past today; a date that isn't real or hasn't come yet opens today instead
const firstDay = dateKeyOf(yearOf(today), 1, 1)
const requested = parseDateKey(route.query.date)

const isReady = ref(false)
const step = ref(0)
const date = ref<DateKey>(requested && requested >= firstDay && requested <= today ? requested : today)
const draft = ref<CheckinDraft>(draftFrom(undefined))

const saved = computed(() => entries.entriesByYear[yearOf(date.value)]?.[date.value])
const isAnswered = computed(() => hasAnswer(step.value, saved.value))
const canGoOn = computed(() => canContinue(step.value, draft.value))

const caption = computed(() => {
  if (!isEditor) return longDate(date.value)
  return isAnswered.value ? 'Editing a saved day' : 'Nothing here yet. Add it below.'
})
const nextLabel = computed(() => {
  if (isEditor) return 'Save'
  return step.value === LAST_STEP ? 'Done' : 'Next'
})

// The day's entry may not be loaded yet; the form starts from what's saved
async function load(day: DateKey): Promise<void> {
  try {
    await entries.fetchYear(yearOf(day))
  } catch (error) {
    console.error(error)
  }
  draft.value = draftFrom(entries.entriesByYear[yearOf(day)]?.[day])
}

onMounted(async () => {
  await load(date.value)
  isReady.value = true
  await showStep(requestedStep() ?? (isEditor ? 0 : firstGap(saved.value)))
})

// ?step=2 opens on that question, if it's a real one
function requestedStep(): number | undefined {
  const value = Number(route.query.step)
  return Number.isInteger(value) && value >= 0 && value <= LAST_STEP ? value : undefined
}

// Each question is its own screen to screen readers: focus moves to its title
async function showStep(index: number): Promise<void> {
  step.value = index
  await card.value?.focusTitle()
}

// The editor's ‹ ›: the same question for the day before or after.
// The address follows, so going back or reloading keeps the day.
async function shiftDay(delta: number): Promise<void> {
  const day = dateKeyOf(yearOf(date.value), monthOf(date.value), dayOf(date.value) + delta)
  if (day < firstDay || day > today) return

  date.value = day
  await load(day)
  void router.replace({ query: { ...route.query, date: day } })
}

// The cache updates at once, so the UI doesn't wait for the server
function save(values: Partial<DayValues>): void {
  entries.save(date.value, values).catch((error: unknown) => {
    console.error(error)
    void status.announce("Couldn't save")
  })
}

function next(): void {
  save(stepValues(step.value, draft.value))
  if (isEditor) leave()
  else if (step.value < LAST_STEP) void showStep(step.value + 1)
  // Replaced, so Back from Done doesn't reopen the last question
  else void router.replace({ name: 'done' })
}

// Back steps through the check-in; from its first question, or from the
// editor, it returns to where the screen was opened
function back(): void {
  if (!isEditor && step.value > 0) void showStep(step.value - 1)
  else leave()
}

function leave(): void {
  if (router.options.history.state.back) router.back()
  else void router.replace({ name: 'home' })
}
</script>

<template>
  <div class="checkin" :aria-busy="!isReady">
    <template v-if="isReady">
      <div class="checkin__header">
        <DaySwitcher
          v-if="isEditor"
          :date="date"
          :previous-disabled="date <= firstDay"
          :next-disabled="date >= today"
          @previous="shiftDay(-1)"
          @next="shiftDay(1)"
        />
        <ProgressStepper v-else :current="step" :total="CHECKIN_STEPS" />
      </div>
      <p class="checkin__caption">{{ caption }}</p>

      <CheckinCard
        ref="card"
        v-model:draft="draft"
        :step="step"
        :wondering="isEditor && !isAnswered"
      />

      <div class="checkin__actions">
        <BaseButton variant="light" class="checkin__back" @click="back">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path d="M15 6l-6 6l6 6" />
          </svg>
          <span>Back</span>
        </BaseButton>
        <BaseButton class="checkin__next" :disabled="!canGoOn" @click="next">
          <span>{{ nextLabel }}</span>
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
