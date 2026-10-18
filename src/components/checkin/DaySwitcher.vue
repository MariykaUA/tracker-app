<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { mediumDate } from '@/utils/date'
import type { DateKey } from '@/types/entry'

// The one-day editor's header: ‹ Sun 4 October ›. The date is announced when the
// arrows change it, so screen reader users hear which day they're on.
defineProps<{
  date: DateKey
  previousDisabled: boolean
  nextDisabled: boolean
}>()

defineEmits<{ previous: []; next: [] }>()
</script>

<template>
  <div class="day-switcher">
    <BaseButton
      variant="light"
      size="sm"
      aria-label="Previous day"
      :disabled="previousDisabled"
      @click="$emit('previous')"
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
        <path d="M15 6l-6 6l6 6" />
      </svg>
    </BaseButton>
    <p class="day-switcher__date" aria-live="polite">{{ mediumDate(date) }}</p>
    <BaseButton
      variant="light"
      size="sm"
      aria-label="Next day"
      :disabled="nextDisabled"
      @click="$emit('next')"
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.day-switcher {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.day-switcher__date {
  text-align: center;
  @include type('button');
}
</style>
