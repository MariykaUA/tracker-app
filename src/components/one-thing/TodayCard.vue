<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// Today's one thing at the top of the One thing tab: a prompt to write it,
// or what was written with "Written" and "Edit"
defineProps<{
  text?: string
  to: RouteLocationRaw
}>()
</script>

<template>
  <RouterLink :to="to" class="today-card" :class="{ 'today-card--written': text }">
    <span class="today-card__top">
      <span class="today-card__tags">
        <span class="today-card__today">Today</span>
        <span v-if="text" class="today-card__status">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          Written
        </span>
      </span>
      <span v-if="text" class="today-card__edit">
        Edit
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </span>
    </span>

    <template v-if="text">
      <span class="today-card__text">{{ text }}</span>
    </template>
    <template v-else>
      <span class="today-card__text">What’s one thing worth celebrating today?</span>
      <span class="today-card__field">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
        <span>Tap to write it down</span>
      </span>
    </template>
  </RouterLink>
</template>

<style scoped lang="scss">
.today-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: $space-5 $space-5 22px;
  border: 1.5px solid $color-peach-border;
  border-radius: $radius-card;
  background: $color-peach;
  box-shadow: $shadow-highlight;
  color: $color-ink;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform $duration-press ease,
    box-shadow $duration-press ease,
    filter $duration-fast ease;

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(3px);
  }

  svg {
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.today-card--written {
  gap: $space-3;
}

.today-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;
}

.today-card__tags {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.today-card__today {
  padding: $space-1 10px;
  border-radius: $radius-pill;
  background: $color-card;
  @include type('eyebrow');
}

.today-card__status,
.today-card__edit {
  display: flex;
  align-items: center;
  gap: $space-1;
  @include type('chip');

  svg {
    stroke-width: 3;
  }
}

.today-card__edit {
  color: $color-ink-soft;

  svg {
    stroke-width: 2.6;
  }
}

.today-card__text {
  overflow-wrap: anywhere;
  @include type('title-sm');
}

// Looks like a text field; the whole card is the link
.today-card__field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 $space-4;
  border-radius: $radius-button;
  background: $color-card;
  box-shadow: inset 0 0 0 2px $color-peach-edge;
  color: $color-ink-soft;
  @include type('body-strong');

  svg {
    color: $color-ink;
    stroke-width: 2.4;
  }
}
</style>
