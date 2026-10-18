<script setup lang="ts">
import { computed, useId } from 'vue'
import BaseButton from './BaseButton.vue'
import { buzz, TAP } from '@/services/haptics.service'

// A whole-number field with −/+ buttons. The model is the field's text:
// digits only, '' while empty, so "nothing entered" and 0 stay different.
const props = withDefaults(
  defineProps<{
    label: string
    decreaseLabel: string // e.g. "500 fewer steps"
    increaseLabel: string
    step: number
    max: number
    placeholder?: string
  }>(),
  { placeholder: '0' },
)

const model = defineModel<string>({ required: true })
const id = useId()

const maxDigits = computed(() => String(props.max).length)
const current = computed(() => Number.parseInt(model.value || '0', 10) || 0)

// Drops anything that isn't a digit and leading zeros. The field is corrected
// directly too, since a refused letter leaves the model (and so the render) unchanged.
function onInput(event: Event): void {
  const field = event.target as HTMLInputElement
  const digits = field.value.replace(/\D/g, '').slice(0, maxDigits.value)
  const clean = digits ? String(Number.parseInt(digits, 10)) : ''

  field.value = clean
  model.value = clean
}

function change(delta: number): void {
  buzz(TAP)
  model.value = String(Math.min(props.max, Math.max(0, current.value + delta)))
}
</script>

<template>
  <div class="number-stepper">
    <label :for="id" class="number-stepper__label">{{ label }}</label>
    <div class="number-stepper__row">
      <BaseButton
        variant="light"
        size="sm"
        class="number-stepper__button number-stepper__button--down"
        :aria-label="decreaseLabel"
        @click="change(-step)"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M6 12h12" />
        </svg>
      </BaseButton>
      <input
        :id="id"
        class="number-stepper__field"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :placeholder="placeholder"
        :value="model"
        @input="onInput"
      />
      <BaseButton
        variant="light"
        size="sm"
        class="number-stepper__button number-stepper__button--up"
        :aria-label="increaseLabel"
        @click="change(step)"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 6v12M6 12h12" />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Never wider than its container, so the field can shrink on narrow screens
.number-stepper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  max-width: 100%;
}

.number-stepper__label {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.number-stepper__row {
  display: flex;
  align-items: center;
  gap: $space-3;
  max-width: 100%;
}

// Nested, so the fills win over BaseButton's own light background
.number-stepper__row {
  .number-stepper__button svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
  }

  .number-stepper__button--down {
    background-color: $color-stepper-down;
    color: $color-stepper-down-ink;
  }

  .number-stepper__button--up {
    background-color: $color-stepper-up;
  }
}

// 148px wide like the prototype, narrower when the screen is (320px reflow)
.number-stepper__field {
  flex: 0 1 148px;
  min-width: 0;
  height: $tap-min;
  padding: 0 $space-4;
  border: $border-card;
  border-radius: $radius-pill;
  background: $color-sunken;
  box-shadow: $shadow-pressed;
  color: $color-ink;
  text-align: center;
  @include type('title-xs');

  &::placeholder {
    color: $color-ink-soft;
    opacity: 0.85;
  }
}
</style>
