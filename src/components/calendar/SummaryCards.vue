<script setup lang="ts">
import type { TrackerSummary } from '@/types/calendar'

// The two small cards under the month and week views ("Average slept 7.2 h").
// A description list, so each number is read with its name.
defineProps<{ summary: TrackerSummary }>()
</script>

<template>
  <dl class="summary-cards">
    <div class="summary-cards__card">
      <dt class="summary-cards__label">{{ summary.stat1 }}</dt>
      <dd class="summary-cards__value">{{ summary.stat1Value }}</dd>
    </div>
    <div class="summary-cards__card">
      <dt class="summary-cards__label">{{ summary.stat2 }}</dt>
      <dd class="summary-cards__value">{{ summary.stat2Value }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: $space-3;
  margin: 0;
}

.summary-cards__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-1;
  padding: $space-4;
  border: $border-card;
  border-radius: $radius-panel;
  background: $color-card-soft;
  text-align: center;
  @include glass('sm');
}

.summary-cards__label {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.summary-cards__value {
  margin: 0;
  @include type('title-xs');
}
</style>
