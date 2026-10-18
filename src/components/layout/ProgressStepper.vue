<script setup lang="ts">
// The check-in's progress bar: one segment per question, read as "Question 2 of 6"
defineProps<{
  current: number // 0-based
  total: number
}>()
</script>

<template>
  <div class="progress-stepper" role="img" :aria-label="`Question ${current + 1} of ${total}`">
    <div
      v-for="index in total"
      :key="index"
      class="progress-stepper__segment"
      :class="{
        'progress-stepper__segment--done': index - 1 < current,
        'progress-stepper__segment--current': index - 1 === current,
      }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.progress-stepper {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 6px;
  height: $tap-target;
  padding: 0 $space-4;
  border: $border-card;
  border-radius: $radius-pill;
  background: $color-card-soft;
  box-shadow: $shadow-pill;
  @include glass('sm');
}

.progress-stepper__segment {
  flex: 1;
  height: 10px;
  border-radius: $radius-pill;
  background: $color-track;
  box-shadow: $shadow-pressed;
  transition:
    background $duration-fade ease,
    opacity $duration-fade ease;
}

.progress-stepper__segment--done,
.progress-stepper__segment--current {
  background: $color-primary-edge;
  box-shadow: $shadow-cell;
}

.progress-stepper__segment--done {
  opacity: 0.55;
}
</style>
