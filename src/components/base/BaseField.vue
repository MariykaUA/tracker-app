<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue'

// A labelled text field (the prototype's tj-field) with an optional hint and
// error under it. An error replaces the hint and marks the field invalid.
// `password` adds the show/hide button.
const props = withDefaults(
  defineProps<{
    label: string
    autocomplete: string
    hint?: string
    error?: string
    password?: boolean
  }>(),
  { hint: undefined, error: undefined, password: false },
)

const model = defineModel<string>({ required: true })
const id = useId()
const input = useTemplateRef<HTMLInputElement>('input')
const isShown = ref(false)

const noteId = `${id}-note`
const note = computed(() => props.error ?? props.hint)

// The view moves focus here when this field has an error
function focus(): void {
  input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="base-field">
    <label :for="id" class="base-field__label">{{ label }}</label>
    <div class="base-field__box">
      <input
        :id="id"
        ref="input"
        v-model="model"
        class="base-field__input"
        :class="{ 'base-field__input--password': password }"
        :type="password && !isShown ? 'password' : 'text'"
        :autocomplete="autocomplete"
        autocapitalize="none"
        spellcheck="false"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="note ? noteId : undefined"
      />
      <button
        v-if="password"
        type="button"
        class="base-field__toggle"
        aria-label="Show password"
        :aria-pressed="isShown"
        @click="isShown = !isShown"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
          <path d="M2.5 12S6 5.5 12 5.5S21.5 12 21.5 12S18 18.5 12 18.5S2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
    <p
      v-if="note"
      :id="noteId"
      class="base-field__note"
      :class="{ 'base-field__note--error': error }"
    >
      {{ note }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-field__label {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.base-field__box {
  position: relative;
}

.base-field__input {
  display: block;
  width: 100%;
  height: $tap-min;
  padding: 0 $space-4;
  border: $border-card;
  border-radius: $radius-row;
  background: $color-sunken;
  box-shadow: $shadow-pressed;
  color: $color-ink;
  @include type('button');
  font-weight: 700;
  line-height: 1.5rem;
}

// Room for the show/hide button
.base-field__input--password {
  padding-right: 56px;
}

.base-field__toggle {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $tap-target;
  height: $tap-target;
  padding: 0;
  border: 0;
  border-radius: $radius-chip;
  background: transparent;
  color: $color-ink-soft;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform $duration-press ease;

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:active {
    transform: translateY(3px);
  }
}

.base-field__note {
  color: $color-ink-soft;
  @include type('small');
}

// Darker than the hint, so it reads as more than a hint (no error colour in the prototype)
.base-field__note--error {
  color: $color-ink;
}
</style>
