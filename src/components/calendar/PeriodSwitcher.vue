<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

// "October 2026" with ‹ › to move between periods. The title is announced when
// it changes, so screen reader users hear where the arrows took them.
defineProps<{
  title: string
  previousLabel: string // "Previous month"
  nextLabel: string
  previousDisabled: boolean
  nextDisabled: boolean
}>()

defineEmits<{ previous: []; next: [] }>()
</script>

<template>
  <div class="period-switcher">
    <h2 class="period-switcher__title" aria-live="polite">{{ title }}</h2>
    <div class="period-switcher__arrows">
      <BaseButton
        variant="light"
        size="sm"
        class="period-switcher__arrow"
        :aria-label="previousLabel"
        :disabled="previousDisabled"
        @click="$emit('previous')"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </BaseButton>
      <BaseButton
        variant="light"
        size="sm"
        class="period-switcher__arrow"
        :aria-label="nextLabel"
        :disabled="nextDisabled"
        @click="$emit('next')"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.period-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
}

.period-switcher__title {
  @include type('heading');
}

// Nested, so the pink fill wins over BaseButton's own light background
.period-switcher__arrows {
  display: flex;
  gap: $space-2;
  padding-bottom: 3px;

  .period-switcher__arrow {
    background-color: $color-stepper-up;
  }

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
