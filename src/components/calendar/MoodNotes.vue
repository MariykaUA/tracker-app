<script setup lang="ts">
import { computed } from 'vue'
import { TRACKERS } from '@/constants/trackers'
import { isLogged } from '@/utils/checkin'
import { longDate } from '@/utils/date'
import type { WeekDay } from '@/types/entry'

// The notes under the mood month and week views, newest first, each with the
// day's mood colour and word beside it
const props = defineProps<{
  days: WeekDay[] // the days on screen, oldest first
  caption: string // "October", "This week"
  emptyText: string
}>()

const notes = computed(() =>
  props.days
    .filter(({ entry }) => entry?.note)
    .map(({ date, entry }) => {
      const hasMood = isLogged('mood', entry)
      const level = hasMood ? TRACKERS.mood.level(entry!) : 0
      return {
        date,
        text: entry!.note!,
        mood: hasMood ? `Mood: ${TRACKERS.mood.say(entry!)}` : 'No mood logged',
        color: hasMood ? TRACKERS.mood.colors[level - 1] : undefined,
      }
    })
    .reverse(),
)
</script>

<template>
  <section class="mood-notes" aria-label="Mood notes">
    <div class="mood-notes__head">
      <h2 class="mood-notes__title">Notes</h2>
      <p class="mood-notes__caption">{{ caption }}</p>
    </div>

    <ul v-if="notes.length" class="mood-notes__list">
      <li v-for="note in notes" :key="note.date" class="mood-notes__note">
        <span
          class="mood-notes__mood-bar"
          aria-hidden="true"
          :style="note.color ? { backgroundColor: note.color } : undefined"
        ></span>
        <span class="mood-notes__text">
          <span class="mood-notes__date">{{ longDate(note.date) }}</span>
          <span class="mood-notes__body">{{ note.text }}</span>
          <span class="mood-notes__mood">{{ note.mood }}</span>
        </span>
        <svg class="mood-notes__chevron" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </li>
    </ul>
    <p v-else class="mood-notes__empty">{{ emptyText }}</p>
  </section>
</template>

<style scoped lang="scss">
.mood-notes {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.mood-notes__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $space-3;
  margin: 0 $space-1;
}

.mood-notes__title {
  @include type('heading');
}

.mood-notes__caption {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.mood-notes__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  list-style: none;
}

.mood-notes__note {
  display: flex;
  align-items: center;
  gap: $space-3;
  min-height: 64px;
  padding: $space-3 $space-3 $space-3 14px;
  border: $border-card;
  border-radius: $radius-panel;
  background: $color-card-soft;
  @include glass('sm');
}

// A note without a mood gets the plain lilac bar
.mood-notes__mood-bar {
  flex: none;
  align-self: stretch;
  width: 10px;
  min-height: 36px;
  border-radius: 5px;
  background: $color-edge;
  box-shadow: $shadow-cell;
}

.mood-notes__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.mood-notes__date {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.mood-notes__body {
  overflow-wrap: anywhere;
  @include type('body-strong');
}

.mood-notes__mood {
  color: $color-ink-soft;
  @include type('caption');
  letter-spacing: normal;
}

.mood-notes__chevron {
  flex: none;
  fill: none;
  stroke: $color-ink-soft;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mood-notes__empty {
  padding: $space-4;
  border: 2px dashed $color-edge;
  border-radius: $radius-panel;
  color: $color-ink-soft;
  text-align: center;
  @include type('label');
}
</style>
