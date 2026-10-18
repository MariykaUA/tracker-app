<script setup lang="ts">
// One check-in question: its title (the screen's <h1>) and the answer below it,
// centred in the space left in the card. Slides in each time a question opens.
defineProps<{
  title: string
  titleId?: string // lets a field use the title as its label
}>()
</script>

<template>
  <div class="checkin-question motion-slide">
    <h1 :id="titleId" tabindex="-1" class="checkin-question__title">{{ title }}</h1>
    <div class="checkin-question__answer">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkin-question {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.checkin-question__title {
  text-align: center;
  @include type('title');
}

.checkin-question__answer {
  margin: auto 0;
}
</style>
