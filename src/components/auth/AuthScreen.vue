<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import GlassCard from '@/components/base/GlassCard.vue'
import PebbleWaving from '@/components/mascot/PebbleWaving.vue'

// The shared layout of Sign in and Create an account (artboards 18 and 19):
// waving Pebble and title, the form card, and the link to the other screen
defineProps<{
  title: string
  lead: string
  submitLabel: string
  busy: boolean
  switchText: string // "New here?"
  switchLabel: string // "Create an account"
  switchTo: RouteLocationRaw
}>()

const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="auth-screen">
    <div class="auth-screen__header motion-rise">
      <PebbleWaving />
      <h1 tabindex="-1" class="auth-screen__title">{{ title }}</h1>
      <p class="auth-screen__lead">{{ lead }}</p>
    </div>

    <GlassCard
      as="form"
      class="auth-screen__form motion-rise"
      novalidate
      :aria-busy="busy"
      @submit.prevent="emit('submit')"
    >
      <slot />
      <BaseButton type="submit" class="auth-screen__submit">
        <span>{{ submitLabel }}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6l-6 6" />
        </svg>
      </BaseButton>
    </GlassCard>

    <p class="auth-screen__switch">
      <span>{{ switchText }}</span>
      <RouterLink :to="switchTo" replace class="auth-screen__link">{{ switchLabel }}</RouterLink>
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-screen {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-height: 100%;
  padding: $space-page-top $space-4 34px;
}

.auth-screen__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
}

.auth-screen__title {
  text-align: center;
  @include type('title');
}

.auth-screen__lead {
  color: $color-ink-soft;
  text-align: center;
  @include type('body');
  font-weight: 700;
}

// Fills the screen like the prototype, but grows rather than squashing its
// fields when they need more room (errors, large text)
.auth-screen__form {
  flex: 1 0 auto;
}

.auth-screen__submit {
  margin-top: auto;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.auth-screen__switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: $space-1;
  color: $color-ink-soft;
  @include type('body');
  font-weight: 700;
}

.auth-screen__link {
  display: inline-flex;
  align-items: center;
  min-height: $tap-target;
  padding: 0 $space-2;
  border-radius: 12px;
  color: $color-ink;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
