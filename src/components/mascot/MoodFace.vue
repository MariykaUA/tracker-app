<script setup lang="ts">
import type { Mood } from '@/types/entry'

// Pebble's face for each mood (Character sheet: "Mood faces"), as drawn on the
// check-in tiles: ears droop and brows furrow as the mood drops
defineProps<{ mood: Mood }>()
</script>

<template>
  <svg aria-hidden="true" width="34" height="31" viewBox="10 16 100 90">
    <template v-if="mood === 'great'">
      <ellipse class="ears" cx="20" cy="60" rx="12" ry="23" transform="rotate(24 20 60)" />
      <ellipse class="ears" cx="100" cy="60" rx="12" ry="23" transform="rotate(-24 100 60)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cheek" cx="35" cy="77" rx="8" ry="5" />
      <ellipse class="cheek" cx="85" cy="77" rx="8" ry="5" />
      <path class="line" d="M40 69q5-7 10 0M70 69q5-7 10 0" stroke-width="3.4" />
      <ellipse class="ink" cx="60" cy="72" rx="3.5" ry="2.6" />
      <path class="tongue" d="M52 77q8 11 16 0z" stroke-width="2.6" />
    </template>

    <template v-else-if="mood === 'good'">
      <ellipse class="ears" cx="22" cy="64" rx="12" ry="23" transform="rotate(16 22 64)" />
      <ellipse class="ears" cx="98" cy="64" rx="12" ry="23" transform="rotate(-16 98 64)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
      <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
      <circle class="ink" cx="45" cy="67" r="4" />
      <circle class="ink" cx="75" cy="67" r="4" />
      <ellipse class="ink" cx="60" cy="72" rx="3.5" ry="2.6" />
      <path class="line" d="M53 77q3.5 4 7 0q3.5 4 7 0" stroke-width="3" />
    </template>

    <template v-else-if="mood === 'okay'">
      <ellipse class="ears" cx="22" cy="66" rx="12" ry="23" transform="rotate(12 22 66)" />
      <ellipse class="ears" cx="98" cy="66" rx="12" ry="23" transform="rotate(-12 98 66)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" opacity="0.7" />
      <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" opacity="0.7" />
      <circle class="ink" cx="45" cy="67" r="4" />
      <circle class="ink" cx="75" cy="67" r="4" />
      <ellipse class="ink" cx="60" cy="72" rx="3.5" ry="2.6" />
      <path class="line" d="M54 79h12" stroke-width="3" />
    </template>

    <template v-else-if="mood === 'low'">
      <ellipse class="ears" cx="23" cy="72" rx="11" ry="23" transform="rotate(6 23 72)" />
      <ellipse class="ears" cx="97" cy="72" rx="11" ry="23" transform="rotate(-6 97 72)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cheek" cx="35" cy="78" rx="7" ry="4.5" opacity="0.55" />
      <ellipse class="cheek" cx="85" cy="78" rx="7" ry="4.5" opacity="0.55" />
      <path class="line" d="M39 62l9-3M81 62l-9-3" stroke-width="3" />
      <circle class="ink" cx="45" cy="69" r="4" />
      <circle class="ink" cx="75" cy="69" r="4" />
      <ellipse class="ink" cx="60" cy="74" rx="3.5" ry="2.6" />
      <path class="line" d="M54 82q6-5 12 0" stroke-width="3" />
    </template>

    <template v-else>
      <ellipse class="ears" cx="24" cy="76" rx="11" ry="23" transform="rotate(2 24 76)" />
      <ellipse class="ears" cx="96" cy="76" rx="11" ry="23" transform="rotate(-2 96 76)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cheek" cx="35" cy="79" rx="7" ry="4.5" opacity="0.4" />
      <ellipse class="cheek" cx="85" cy="79" rx="7" ry="4.5" opacity="0.4" />
      <path class="line" d="M38 62l10-4M82 62l-10-4" stroke-width="3" />
      <path class="line" d="M40 69q5 4 10 0M70 69q5 4 10 0" stroke-width="3.4" />
      <ellipse class="ink" cx="60" cy="75" rx="3.5" ry="2.6" />
      <path class="line" d="M52 86q8-8 16 0" stroke-width="3" />
    </template>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;
</style>
