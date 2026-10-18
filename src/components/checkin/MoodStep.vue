<script setup lang="ts">
import CheckinQuestion from './CheckinQuestion.vue'
import ChoiceTiles from '@/components/base/ChoiceTiles.vue'
import MoodFace from '@/components/mascot/MoodFace.vue'
import { MOOD_CHOICES } from '@/constants/trackers'
import type { Mood } from '@/types/entry'

// Check-in 3: one of five moods, each tile with Pebble's matching face
const mood = defineModel<Mood | null>({ required: true })
</script>

<template>
  <CheckinQuestion title="What's your vibe?">
    <ChoiceTiles v-model="mood" legend="Mood" layout="grid" :options="MOOD_CHOICES">
      <template #icon="{ option }">
        <span class="mood-step__face" aria-hidden="true">
          <MoodFace :mood="option.value" />
        </span>
      </template>
    </ChoiceTiles>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
.mood-step__face {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: $radius-pill;
  background: $color-face;
}
</style>
