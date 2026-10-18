<script setup lang="ts">
import { computed } from 'vue'
import { longDate } from '@/utils/date'
import type { DateKey, WeekDay } from '@/types/entry'

// The days before today on the One thing tab, newest first: what was written,
// or "Nothing written". Rows take turns through five colours and white shapes.
// Tapping a row opens that day's one thing in the one-day editor.
const props = defineProps<{
  days: WeekDay[] // newest first
  yesterdayKey: DateKey
}>()

defineEmits<{ pick: [date: DateKey] }>()

const rows = computed(() =>
  props.days.map(({ date, entry }, index) => {
    const text = entry?.imp ?? ''
    return {
      date,
      text,
      shape: index % 5,
      // The prototype's labels: the full date, even where the row says "Yesterday"
      label: text ? `${longDate(date)}: ${text}. Edit` : `${longDate(date)}: nothing written. Add`,
    }
  }),
)
</script>

<template>
  <section class="earlier-days" aria-labelledby="earlier-days-title">
    <h2 id="earlier-days-title" class="earlier-days__title">Earlier days</h2>
    <ul class="earlier-days__list">
      <li v-for="row in rows" :key="row.date">
        <button
          type="button"
          class="earlier-days__row"
          :class="{ 'earlier-days__row--empty': !row.text }"
          :aria-label="row.label"
          @click="$emit('pick', row.date)"
        >
          <svg
            class="earlier-days__shape"
            aria-hidden="true"
            width="76"
            height="76"
            viewBox="0 0 24 24"
          >
            <path
              v-if="row.shape === 0"
              d="M12 2.5l2.6 6.1l6.4.6l-4.9 4.3l1.5 6.4L12 16.6l-5.6 3.3l1.5-6.4L3 9.2l6.4-.6z"
            />
            <path
              v-else-if="row.shape === 1"
              d="M12 21c-5.4-4.1-9-7.2-9-11a4.8 4.8 0 0 1 9-2.4a4.8 4.8 0 0 1 9 2.4c0 3.8-3.6 6.9-9 11z"
            />
            <circle v-else-if="row.shape === 2" cx="12" cy="12" r="9" />
            <path
              v-else-if="row.shape === 3"
              d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"
            />
            <path
              v-else
              d="M12 4a3.2 3.2 0 0 1 3.2 3.2a3.2 3.2 0 1 1 1.6 6a3.2 3.2 0 1 1-4.8 4a3.2 3.2 0 1 1-4.8-4a3.2 3.2 0 1 1 1.6-6A3.2 3.2 0 0 1 12 4z"
            />
          </svg>

          <span class="earlier-days__text">
            <span class="earlier-days__date">
              {{ row.date === yesterdayKey ? 'Yesterday' : longDate(row.date) }}
            </span>
            <span class="earlier-days__thing">{{ row.text || 'Nothing written' }}</span>
          </span>

          <span v-if="!row.text" class="earlier-days__add" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add
          </span>
          <svg
            v-else
            class="earlier-days__chevron"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use 'sass:list';

$rotations:
  -14deg,
  10deg,
  0deg,
  18deg,
  -8deg,
  12deg,
  -16deg;

.earlier-days {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.earlier-days__title {
  margin: 0 $space-1;
  @include type('heading-sm');
  font-size: 1.125rem; // 18px here, a size smaller than heading-sm elsewhere
}

.earlier-days__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  list-style: none;
}

// The prototype's tj-tile: brightens on hover, presses down when tapped
.earlier-days__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-3;
  width: 100%;
  min-height: 64px;
  padding: $space-3 14px $space-3 $space-4;
  overflow: hidden;
  border: 0;
  border-radius: $radius-tile;
  color: $color-ink;
  text-align: left;
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
}

// The five tones in turn, as in the prototype
@for $i from 1 through 5 {
  .earlier-days__list > li:nth-child(5n + #{$i}) .earlier-days__row {
    $tone: list.nth($earlier-tones, $i);
    background: list.nth($tone, 1);
    box-shadow:
      0 4px 0 list.nth($tone, 2),
      $shadow-tile-shine;
  }
}

// Same weight as the tones and after them, so an empty day is always the plain white row
.earlier-days__list > li:nth-child(n) .earlier-days__row--empty {
  background: $color-earlier-empty;
  box-shadow: inset 0 0 0 1.5px $color-border;
}

// A big white shape peeking out on the right, each row tilted its own way
.earlier-days__shape {
  position: absolute;
  right: 18px;
  bottom: -22px;
  fill: $color-card;
  opacity: 0.45;
}

@for $i from 1 through 7 {
  .earlier-days__list > li:nth-child(#{$i}) .earlier-days__shape {
    transform: rotate(list.nth($rotations, $i));
  }
}

.earlier-days__text,
.earlier-days__add,
.earlier-days__chevron {
  position: relative;
  z-index: 1;
}

.earlier-days__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.earlier-days__date {
  @include type('eyebrow');
}

.earlier-days__thing {
  overflow-wrap: anywhere;
  @include type('heading');
  font-weight: 600;
}

.earlier-days__row--empty .earlier-days__thing {
  color: $color-ink-soft;
  @include type('body');
  line-height: 1.375rem;
}

.earlier-days__add {
  display: flex;
  flex: none;
  align-items: center;
  gap: $space-1;
  height: 32px;
  padding: 0 $space-3;
  border-radius: $radius-pill;
  background: $color-card;
  box-shadow: inset 0 0 0 1.5px $color-ink-future;
  @include type('chip');

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
  }
}

.earlier-days__chevron {
  flex: none;
  fill: none;
  stroke: $color-ink;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
