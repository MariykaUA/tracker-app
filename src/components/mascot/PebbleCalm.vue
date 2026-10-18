<!-- Pebble breathing slowly among drifting leaves: the anxiety check-in -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="176" height="120" viewBox="0 0 176 120">
    <path class="motion-bob leaf" d="M18 40c5-9 15-10 21-3c-5 9-15 10-21 3z" />
    <path class="leaf leaf--mint" d="M138 26c7-6 16-4 19 4c-7 6-16 4-19-4z" />
    <path class="motion-bob leaf" d="M146 70c4-7 12-8 17-2c-4 7-12 8-17 2z" />
    <g class="motion-breathe">
      <g transform="translate(28 8)">
        <ellipse class="body" cx="60" cy="100" rx="28" ry="16" />
        <ellipse class="ears" cx="22" cy="68" rx="12" ry="23" transform="rotate(10 22 68)" />
        <ellipse class="ears" cx="98" cy="68" rx="12" ry="23" transform="rotate(-10 98 68)" />
        <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
        <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
        <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
        <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
        <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
        <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
        <path class="line" d="M40 67q5 5 10 0M70 67q5 5 10 0" stroke-width="2.4" />
        <ellipse class="ink" cx="60" cy="72" rx="3" ry="2.2" />
        <path class="line" d="M54 78q6 4 12 0" stroke-width="2.2" />
      </g>
    </g>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.leaf {
  fill: $scene-leaf;
}

.leaf--mint {
  fill: $scene-mint;
}
</style>
