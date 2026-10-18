<script setup lang="ts">
import { computed, useId } from 'vue'

// A native range input styled like the prototype's tj-range, with a visible label.
// The default slot is the readout next to the label ("7.5 h", "Rested").
const props = withDefaults(
  defineProps<{
    label: string
    min: number
    max: number
    step?: number
    valueText: string // the value in words for screen readers ("7.5 hours")
    ticks: readonly string[] // words under the track ("0 6 12", "Drained … Fully rested")
    layout?: 'stacked' | 'inline' // label above the readout, or beside it
    insetTicks?: boolean // pull the outer ticks in under the thumb's centre
  }>(),
  { step: 1, layout: 'inline', insetTicks: false },
)

const model = defineModel<number>({ required: true })
const id = useId()

// The fill ends under the thumb's centre: 18px is half the 36px thumb
const fillWidth = computed(() => {
  const share = (model.value - props.min) / (props.max - props.min)
  return `calc(18px + (100% - 36px) * ${share.toFixed(4)})`
})
</script>

<template>
  <div class="range-slider">
    <div class="range-slider__head" :class="`range-slider__head--${layout}`">
      <label :for="id" class="range-slider__label">{{ label }}</label>
      <slot />
    </div>
    <div class="range-slider__control">
      <div class="range-slider__track" aria-hidden="true"></div>
      <div class="range-slider__fill" aria-hidden="true" :style="{ width: fillWidth }"></div>
      <input
        :id="id"
        v-model.number="model"
        class="range-slider__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuetext="valueText"
      />
    </div>
    <div
      class="range-slider__ticks"
      :class="{ 'range-slider__ticks--inset': insetTicks }"
      aria-hidden="true"
    >
      <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
$thumb: 36px;

.range-slider {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.range-slider__head--stacked {
  display: flex;
  flex-direction: column;

  .range-slider__label {
    color: $color-ink-soft;
    @include type('eyebrow');
  }
}

.range-slider__head--inline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: $space-3;
}

.range-slider__control {
  position: relative;
  height: $tap-target;
}

.range-slider__track,
.range-slider__fill {
  position: absolute;
  top: 14px;
  left: 0;
  height: 16px;
  border-radius: $radius-pill;
}

.range-slider__track {
  right: 0;
  background: $color-track;
  box-shadow: $shadow-pressed;
}

.range-slider__fill {
  background:
    linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 60%),
    $color-fill;
}

.range-slider__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $tap-target;
  margin: 0;
  border-radius: $radius-pill;
  background: transparent;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-runnable-track {
    height: $tap-target;
    background: transparent;
  }

  &::-moz-range-track {
    height: $tap-target;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    width: $thumb;
    height: $thumb;
    margin-top: 4px;
    border: 1.5px solid $color-card;
    border-radius: $radius-pill;
    background: linear-gradient($color-card, $color-thumb-end);
    box-shadow: $shadow-thumb;
    transition: transform $duration-fast ease;
    -webkit-appearance: none;
  }

  &:active::-webkit-slider-thumb {
    transform: scale(1.08);
  }

  // Firefox gets only the outer shadow, as in the prototype
  &::-moz-range-thumb {
    width: $thumb;
    height: $thumb;
    border: 1.5px solid $color-card;
    border-radius: $radius-pill;
    background: linear-gradient($color-card, $color-thumb-end);
    box-shadow: 0 6px 12px rgba(120, 90, 160, 0.32);
  }
}

.range-slider__ticks {
  display: flex;
  justify-content: space-between;
  margin-top: -4px;
  color: $color-ink-soft;
  @include type('caption');
  letter-spacing: normal;
}

.range-slider__ticks--inset {
  padding: 0 $space-3;
}
</style>
