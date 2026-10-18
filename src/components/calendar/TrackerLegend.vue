<script setup lang="ts">
import { computed } from 'vue'
import { TRACKERS } from '@/constants/trackers'
import type { TrackerId } from '@/types/entry'

// Every colour a tracker uses, with its word, so no cell relies on colour alone
const props = defineProps<{ trackerId: TrackerId }>()

const items = computed(() => {
  const def = TRACKERS[props.trackerId]
  return def.legend.map((level) => ({
    level,
    label: def.labels[level - 1] ?? '',
    color: def.colors[level - 1] ?? '',
  }))
})
</script>

<template>
  <ul class="tracker-legend">
    <li v-for="item in items" :key="item.level" class="tracker-legend__item">
      <span
        class="tracker-legend__swatch"
        aria-hidden="true"
        :style="{ backgroundColor: item.color }"
      ></span>
      {{ item.label }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.tracker-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
}

.tracker-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: $space-1 10px $space-1 5px;
  border: $border-card;
  border-radius: $radius-pill;
  background: $color-card-soft;
  @include type('label');
}

.tracker-legend__swatch {
  flex: none;
  width: 16px;
  height: 16px;
  border-radius: $radius-swatch;
  box-shadow: $shadow-cell;
}
</style>
