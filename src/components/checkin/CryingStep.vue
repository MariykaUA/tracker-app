<script setup lang="ts">
import CheckinQuestion from './CheckinQuestion.vue'
import ChoiceTiles from '@/components/base/ChoiceTiles.vue'
import { CRYING_CHOICES, TRACKERS } from '@/constants/trackers'
import type { Crying } from '@/types/entry'

// Check-in 5: no tears, a few, or a good cry
const cry = defineModel<Crying | null>({ required: true })
</script>

<template>
  <CheckinQuestion title="Did the clouds rain today?">
    <ChoiceTiles v-model="cry" legend="Crying" layout="list" :options="CRYING_CHOICES">
      <p class="crying-step__cheer">{{ TRACKERS.crying.cheer }}</p>
    </ChoiceTiles>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
.crying-step__cheer {
  margin-top: $space-4;
  color: $color-ink-soft;
  text-align: center;
  @include type('label');
}
</style>
