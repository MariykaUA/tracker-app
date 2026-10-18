<script setup lang="ts">
import type { RangeView } from '@/types/calendar'

// Calendar · Month · Week. Toggle buttons rather than tabs, as in the
// prototype: the pressed one is the view on screen.
const view = defineModel<RangeView>({ required: true })

const VIEWS: { value: RangeView; label: string }[] = [
  { value: 'year', label: 'Calendar' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
]
</script>

<template>
  <div class="range-tabs" role="group" aria-label="Choose a view">
    <button
      v-for="option in VIEWS"
      :key="option.value"
      type="button"
      class="range-tabs__button"
      :class="{ 'is-active': view === option.value }"
      :aria-pressed="view === option.value"
      @click="view = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.range-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $space-1;
  padding: $space-1 $space-1 7px;
  border-radius: $radius-button;
  background: $color-sunken;
  box-shadow: $shadow-pressed;
}

// Ghost until pressed, then the small light button
.range-tabs__button {
  min-height: $tap-target;
  padding: 0;
  border: 0;
  border-radius: $radius-chip;
  background: transparent;
  color: $color-ink-soft;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform $duration-press ease,
    box-shadow $duration-press ease,
    filter $duration-fast ease;
  @include type('label');

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(3px);
  }

  &.is-active {
    background: $color-card;
    box-shadow: $shadow-btn-sm;
    color: $color-ink;

    &:active {
      transform: translateY(2px);
      box-shadow: $shadow-btn-sm-active;
    }
  }
}
</style>
