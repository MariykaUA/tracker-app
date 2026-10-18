<script setup lang="ts">
// The prototype's large white glass card. A <section> by default, so with an
// aria-label it's a named region (the calendars use it that way).
withDefaults(defineProps<{ as?: 'section' | 'div' }>(), { as: 'section' })
</script>

<template>
  <component :is="as" class="glass-card">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.glass-card {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-5;
  border: $border-card;
  border-radius: $radius-card;
  background: $color-card;
  box-shadow: $shadow-sheet;
  @include glass;
}
</style>
