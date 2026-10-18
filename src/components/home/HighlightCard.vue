<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { buzz, TAP } from '@/services/haptics.service'
import oneThingIcon from '@/assets/icons/icon-one-thing.png'

// Today's "one thing" at the top of Home; where it leads is passed in
const props = defineProps<{
  text?: string // today's one thing, if written
  to: RouteLocationRaw
}>()

const written = computed(() => !!props.text)

// The prototype's labels; the visible title stays "Today's highlight?"
const label = computed(() =>
  written.value
    ? `Today's highlight: ${props.text}. Tap to edit.`
    : "Most important today: today's highlight. Not written yet. Tap to write it down.",
)
</script>

<template>
  <RouterLink :to="to" class="highlight-card" :aria-label="label" @click="buzz(TAP)">
    <img class="highlight-card__icon" :src="oneThingIcon" alt="" width="52" height="52" />
    <span class="highlight-card__text">
      <span class="highlight-card__title">Today's highlight?</span>
      <span class="highlight-card__sub">{{ written ? text : 'Tap to write it down' }}</span>
    </span>
    <span class="highlight-card__edit" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M4 20h4L19 9l-4-4L4 16z" />
        <path d="M14 6l4 4" />
      </svg>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.highlight-card {
  display: flex;
  align-items: center;
  gap: $space-3;
  width: 100%;
  min-height: 88px;
  padding: $space-4 14px $space-4 $space-4;
  border: 1.5px solid $color-peach-border;
  border-radius: $radius-highlight;
  background-color: $color-peach;
  box-shadow: $shadow-highlight;
  color: $color-ink;
  text-decoration: none;
  @include press;
  @include glass;
}

.highlight-card__icon {
  flex: none;
  width: 52px;
  height: 52px;
  margin: -4px;
  object-fit: contain;
}

.highlight-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.highlight-card__title,
.highlight-card__sub {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.highlight-card__title {
  @include type('heading-sm');
}

.highlight-card__sub {
  color: $color-ink-soft;
  @include type('small');
}

.highlight-card__edit {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: $tap-target;
  height: $tap-target;
  border-radius: $radius-icon;
  background: $color-primary;
  box-shadow: $shadow-icon-button;

  svg {
    fill: none;
    stroke: $color-ink;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
