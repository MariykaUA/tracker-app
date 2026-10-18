<!-- Pebble smiling, bobbing beside the title on Home -->
<template>
  <svg class="motion-bob" aria-hidden="true" width="80" height="72" viewBox="10 16 100 90">
    <ellipse class="ears" cx="22" cy="64" rx="12" ry="23" transform="rotate(16 22 64)" />
    <ellipse class="ears" cx="98" cy="64" rx="12" ry="23" transform="rotate(-16 98 64)" />
    <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
    <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
    <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
    <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
    <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
    <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
    <circle class="ink" cx="45" cy="67" r="3.2" />
    <circle class="ink" cx="75" cy="67" r="3.2" />
    <ellipse class="ink" cx="60" cy="72" rx="3" ry="2.2" />
    <path class="line" d="M53 77q3.5 4 7 0q3.5 4 7 0" stroke-width="2.2" />
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

svg {
  flex: none;
}
</style>
