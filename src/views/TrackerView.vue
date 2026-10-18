<script setup lang="ts">
import { computed } from 'vue'
import { TRACKERS } from '@/constants/trackers'
import type { TrackerId } from '@/types/entry'

// One view for all five trackers; the calendar, month and week come next
const props = defineProps<{ trackerId: TrackerId }>()

const tracker = computed(() => TRACKERS[props.trackerId])
</script>

<template>
  <h1 tabindex="-1" class="title">{{ tracker.name }}</h1>
</template>

<style scoped lang="scss">
.title {
  @include type('title');
}
</style>
