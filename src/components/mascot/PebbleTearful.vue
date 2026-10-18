<!-- Pebble with a tear, drops falling around it: the crying check-in -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="176" height="120" viewBox="0 0 176 120">
    <path
      class="motion-drip drop"
      d="M26 34c2.500 3.500 4.500 5.800 4.500 8.200a4.500 4.500 0 0 1-9 0c0-2.400 2-4.700 4.500-8.200z"
    />
    <path
      class="motion-drip drop drop--sky"
      d="M152 58c2 3 3.600 4.800 3.600 6.800a3.600 3.600 0 0 1-7.200 0c0-2 1.600-3.800 3.600-6.800z"
    />
    <path
      class="motion-bob cap"
      d="M148 24c-4-3-6-5-6-7.500a3 3 0 0 1 6-1a3 3 0 0 1 6 1c0 2.500-2 4.500-6 7.500z"
    />
    <g transform="translate(28 8)">
      <ellipse class="body" cx="60" cy="100" rx="28" ry="16" />
      <ellipse class="ears" cx="23" cy="72" rx="11" ry="23" transform="rotate(6 23 72)" />
      <ellipse class="ears" cx="97" cy="72" rx="11" ry="23" transform="rotate(-6 97 72)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
      <ellipse class="cheek" cx="35" cy="78" rx="7" ry="4.5" />
      <ellipse class="cheek" cx="85" cy="78" rx="7" ry="4.5" />
      <circle class="ink" cx="45" cy="67" r="3.2" />
      <circle class="ink" cx="75" cy="67" r="3.2" />
      <path class="drop" d="M45 72c2.200 3 3.800 5 3.800 7a3.800 3.800 0 0 1-7.600 0c0-2 1.600-4 3.800-7z" />
      <ellipse class="ink" cx="60" cy="73" rx="3" ry="2.2" />
      <path class="line" d="M55 81q5-3 10 0" stroke-width="2.2" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.drop {
  fill: $scene-tear;
}

.drop--sky {
  fill: $scene-sky;
  animation-delay: 900ms;
}
</style>
