<!-- Pebble looking up at a bobbing star: the "one thing" check-in question -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="176" height="120" viewBox="0 0 176 120">
    <circle class="sparkle" cx="22" cy="40" r="3" />
    <circle class="sparkle" cx="158" cy="86" r="2.5" />
    <circle class="cap" cx="34" cy="92" r="2" />
    <g class="motion-bob">
      <g transform="translate(146 36)">
        <path
          class="star"
          d="M0 -18L4.7 -6.5L17.1 -5.6L7.6 2.5L10.6 14.6L0 8L-10.6 14.6L-7.6 2.5L-17.1 -5.6L-4.7 -6.5z"
        />
      </g>
    </g>
    <g transform="translate(22 8)">
      <ellipse class="body" cx="60" cy="100" rx="28" ry="16" />
      <ellipse class="ears" cx="22" cy="66" rx="12" ry="23" transform="rotate(12 22 66)" />
      <ellipse class="ears" cx="98" cy="62" rx="12" ry="23" transform="rotate(-26 98 62)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
      <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
      <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
      <circle class="ink" cx="49" cy="65" r="3.2" />
      <circle class="ink" cx="79" cy="65" r="3.2" />
      <ellipse class="ink" cx="64" cy="71" rx="3" ry="2.2" />
      <path class="line" d="M57 76q3.5 4 7 0q3.5 4 7 0" stroke-width="2.2" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.sparkle {
  fill: $pebble-shine;
}

.star {
  fill: $scene-star;
  stroke: $pebble-ink;
  stroke-width: 2;
  stroke-linejoin: round;
}
</style>
