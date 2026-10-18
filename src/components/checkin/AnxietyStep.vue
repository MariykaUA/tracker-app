<script setup lang="ts">
import CheckinQuestion from './CheckinQuestion.vue'
import ChoiceTiles from '@/components/base/ChoiceTiles.vue'
import { ANXIETY_CHOICES, TRACKERS } from '@/constants/trackers'
import type { Anxiety } from '@/types/entry'

// Check-in 4: calm, mild or high
const anx = defineModel<Anxiety | null>({ required: true })
</script>

<template>
  <CheckinQuestion title="How loud are the worries?">
    <ChoiceTiles v-model="anx" legend="Anxiety" layout="list" :options="ANXIETY_CHOICES">
      <p class="anxiety-step__cheer">{{ TRACKERS.anxiety.cheer }}</p>
    </ChoiceTiles>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
.anxiety-step__cheer {
  margin-top: $space-4;
  color: $color-ink-soft;
  text-align: center;
  @include type('label');
}
</style>
