<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// The prototype's tj-btn. With `to` it's a RouterLink (it navigates), otherwise a button.
withDefaults(
  defineProps<{
    variant?: 'primary' | 'light' | 'ghost' | 'tab'
    size?: 'md' | 'sm' // sm: the 44 × 44 square icon button
    to?: RouteLocationRaw
    disabled?: boolean
    type?: 'button' | 'submit' // a form's main button submits it
  }>(),
  { variant: 'primary', size: 'md', to: undefined, disabled: false, type: 'button' },
)
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: $color-ink;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform $duration-press ease,
    box-shadow $duration-press ease,
    filter $duration-fast ease;
  @include type('button');

  :deep(svg) {
    flex: none;
  }

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(3px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    filter: none;
  }
}

.base-button--md {
  min-height: $tap-min;
  padding: 0 $space-6;
  gap: 10px;
  border-radius: $radius-button;
}

.base-button--primary {
  background: $color-primary;
  box-shadow: $shadow-btn-primary;

  &:active:not(:disabled) {
    box-shadow: $shadow-btn-primary-active;
  }
}

.base-button--light {
  background: $color-card;
  box-shadow: $shadow-btn-light;

  &:active:not(:disabled) {
    box-shadow: $shadow-btn-light-active;
  }
}

.base-button--ghost {
  background: transparent;
  color: $color-ink-soft;
}

.base-button--tab {
  background: $color-bg;
  box-shadow: $shadow-btn-tab;

  &:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: $shadow-btn-tab-active;
  }
}

// After the variants, so its smaller 3D edge wins, as in the prototype
.base-button--sm {
  flex: none;
  width: $tap-target;
  height: $tap-target;
  padding: 0;
  border-radius: $radius-chip;
  box-shadow: $shadow-btn-sm;

  &:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: $shadow-btn-sm-active;
  }
}
</style>
