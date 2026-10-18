<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import PebbleCelebrating from '@/components/mascot/PebbleCelebrating.vue'
import { TRACKER_ORDER, TRACKERS } from '@/constants/trackers'
import { useEntriesStore } from '@/stores/entries.store'
import { isLogged } from '@/utils/checkin'
import { yearOf } from '@/utils/date'
import { formatHours } from '@/utils/format'
import type { Entry, TrackerId } from '@/types/entry'

interface Chip {
  tracker: TrackerId
  text: string
  color: string
  ink: string
}

// How each tracker is summed up in its chip, as in the prototype
const CHIP_TEXT: Record<TrackerId, (entry: Entry) => string> = {
  sleep: (entry) => `${formatHours(entry.hours ?? 0)} h slept`,
  steps: (entry) => TRACKERS.steps.say(entry),
  mood: (entry) => `Mood: ${TRACKERS.mood.say(entry)}`,
  anxiety: (entry) => `Anxiety: ${TRACKERS.anxiety.say(entry)}`,
  crying: (entry) => TRACKERS.crying.say(entry),
}

const CONFETTI_PIECES = 18

const entries = useEntriesStore()

// One chip per tracker logged today, in its level's colour
const chips = computed<Chip[]>(() => {
  const entry = entries.todayEntry
  if (!entry) return []

  return TRACKER_ORDER.filter((tracker) => isLogged(tracker, entry)).map((tracker) => {
    const def = TRACKERS[tracker]
    const level = def.level(entry)
    return {
      tracker,
      text: CHIP_TEXT[tracker](entry),
      color: def.colors[level - 1] ?? '',
      ink: def.ink[level - 1] ?? '',
    }
  })
})

// Normally already loaded by the check-in; needed when Done is opened directly
onMounted(() => {
  entries.fetchYear(yearOf(entries.todayKey)).catch((error: unknown) => console.error(error))
})
</script>

<template>
  <div class="done">
    <div class="done__confetti" aria-hidden="true">
      <div
        v-for="piece in CONFETTI_PIECES"
        :key="piece"
        class="done__confetti-piece motion-confetti"
      ></div>
    </div>

    <div class="done__content motion-rise">
      <div class="done__mascot">
        <PebbleCelebrating />
        <div class="done__badge motion-pop" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
      </div>
      <h1 tabindex="-1" class="done__title">You're done for today!</h1>
      <ul v-if="chips.length" class="done__chips">
        <li
          v-for="chip in chips"
          :key="chip.tracker"
          class="done__chip"
          :style="{ backgroundColor: chip.color, color: chip.ink }"
        >
          {{ chip.text }}
        </li>
      </ul>
    </div>

    <BaseButton variant="light" to="/" replace class="done__home">
      <span>Back to home</span>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6l-6 6" />
      </svg>
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:list';
@use 'sass:math';

.done {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: $space-page-top $space-4 34px;
}

.done__confetti {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.done__confetti-piece {
  position: absolute;
  top: 0;
  box-shadow: $shadow-cell;
}

// The prototype's 18 pieces: spread across the width, three widths, four
// heights, alternating round and square, the six colours, staggered starts
@for $i from 0 to 18 {
  .done__confetti-piece:nth-child(#{$i + 1}) {
    left: math.percentage(math.div(3 + ($i * 37) % 92, 100));
    width: 10px + ($i % 3) * 4px;
    height: 12px + ($i % 4) * 4px;
    background: list.nth($confetti-colors, $i % 6 + 1);
    animation-delay: ($i % 9) * 120ms;

    @if $i % 2 == 1 {
      border-radius: $radius-pill;
    } @else {
      border-radius: 6px;
    }
  }
}

.done__content {
  position: relative;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  gap: $space-4;
  text-align: center;
}

.done__mascot {
  position: relative;
  width: 190px;
  height: 190px;
}

.done__badge {
  position: absolute;
  right: 2px;
  bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 3px solid $color-card;
  border-radius: $radius-pill;
  background: $color-primary;
  box-shadow: $shadow-badge;

  svg {
    fill: none;
    stroke: $color-ink;
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.done__title {
  @include type('title');
}

.done__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $space-2;
  max-width: 320px;
  list-style: none;
}

.done__chip {
  padding: 6px 14px;
  border: $border-card;
  border-radius: $radius-pill;
  box-shadow: $shadow-cell;
  @include type('label');
}

.done__home {
  position: relative;
  align-self: stretch;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
