<script setup lang="ts">
// The prototype's large white glass card. A <section> by default, so with an
// aria-label it's a named region (the calendars use it that way); a <form> on sign-in.
// `low`: the smaller shadow of the Account panels.
withDefaults(defineProps<{ as?: 'section' | 'div' | 'form'; low?: boolean }>(), {
  as: 'section',
  low: false,
})
</script>

<template>
  <component :is="as" class="glass-card" :class="{ 'glass-card--low': low }">
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

.glass-card--low {
  box-shadow: $shadow-nav;
}
</style>
