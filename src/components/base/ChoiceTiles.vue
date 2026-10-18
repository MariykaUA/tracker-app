<script setup lang="ts" generic="T extends string">
import { useId } from 'vue'
import type { ChoiceOption } from '@/types/choice'

// A radio group drawn as the prototype's coloured tiles. Real radio inputs, so
// arrow keys move between tiles; every tile has its word, never colour alone.
// Slots: `icon` (shown above the word, gets the option), default (under the tiles).
defineProps<{
  legend: string
  options: readonly ChoiceOption<T>[]
  layout: 'grid' | 'list' // square tiles three to a row, or full-width rows
}>()

const model = defineModel<T | null>({ required: true })
const name = useId()
</script>

<template>
  <fieldset class="choice-tiles" :class="`choice-tiles--${layout}`">
    <legend class="visually-hidden">{{ legend }}</legend>
    <div class="choice-tiles__options">
      <label
        v-for="option in options"
        :key="option.value"
        :for="`${name}-${option.value}`"
        class="choice-tiles__tile"
        :class="{ 'is-selected': model === option.value }"
        :style="{ '--tile-color': option.color, '--tile-ink': option.ink, '--tile-edge': option.edge }"
      >
        <input
          :id="`${name}-${option.value}`"
          v-model="model"
          class="visually-hidden"
          type="radio"
          :name="name"
          :value="option.value"
        />
        <slot name="icon" :option="option" />
        <span>{{ option.label }}</span>
        <span class="choice-tiles__check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      </label>
    </div>
    <slot />
  </fieldset>
</template>

<style scoped lang="scss">
.choice-tiles__tile {
  position: relative;
  display: flex;
  border-radius: $radius-tile;
  background: var(--tile-color);
  box-shadow:
    0 4px 0 var(--tile-edge),
    $shadow-tile-shine;
  color: var(--tile-ink);
  cursor: pointer;
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

  // The radio itself is hidden, so its focus ring goes on the tile
  &:has(:focus-visible) {
    @include focus-ring;
  }

  &.is-selected {
    box-shadow: $shadow-tile-selected;
  }
}

.choice-tiles__check {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 2px solid $color-ink;
  border-radius: $radius-pill;
  background: $color-chip;

  svg {
    fill: none;
    stroke: $color-accent;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

// Mood: square tiles, three to a row, the tick in the corner of the picked one
.choice-tiles--grid {
  .choice-tiles__options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .choice-tiles__tile {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: calc((100% - 20px) / 3);
    min-height: $tap-target;
    aspect-ratio: 1 / 1;
    padding: $space-2 $space-1;
    text-align: center;
    @include type('label-lg');
  }

  .choice-tiles__check {
    position: absolute;
    top: 6px;
    right: 6px;
    display: none;
  }

  .is-selected .choice-tiles__check {
    display: flex;
  }
}

// Anxiety, crying: full-width rows, the tick at the end, shown on the picked one
.choice-tiles--list {
  .choice-tiles__options {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .choice-tiles__tile {
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    min-height: 64px;
    padding: 0 $space-4 0 $space-5;
    border-radius: $radius-row;
    text-align: left;
    @include type('button');
  }

  .choice-tiles__check {
    opacity: 0;
  }

  .is-selected .choice-tiles__check {
    opacity: 1;
  }
}
</style>
