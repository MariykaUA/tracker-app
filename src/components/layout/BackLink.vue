<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// The small "‹ Back" pill at the top of the Account screens
defineProps<{ to: RouteLocationRaw }>()
</script>

<template>
  <RouterLink :to="to" class="back-link">
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
      <path d="M15 6l-6 6l6 6" />
    </svg>
    <span>Back</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.back-link {
  display: flex;
  align-self: flex-start;
  align-items: center;
  gap: $space-1;
  height: $tap-target;
  padding: 0 $space-4 0 10px;
  border-radius: $radius-chip;
  background: $color-card;
  box-shadow: $shadow-btn-sm;
  color: $color-ink;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform $duration-press ease,
    box-shadow $duration-press ease,
    filter $duration-fast ease;
  @include type('body');
  font-weight: 800;
  line-height: 1.25rem;

  svg {
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: $shadow-btn-sm-active;
  }
}
</style>
