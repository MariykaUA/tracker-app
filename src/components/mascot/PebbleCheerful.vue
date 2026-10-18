<!-- Pebble beaming, bobbing on the spot: the mood check-in -->
<template>
  <svg class="motion-bob" aria-hidden="true" width="116" height="104" viewBox="10 16 100 90">
    <ellipse class="ears" cx="20" cy="60" rx="12" ry="23" transform="rotate(24 20 60)" />
    <ellipse class="ears" cx="100" cy="60" rx="12" ry="23" transform="rotate(-24 100 60)" />
    <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
    <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
    <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
    <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
    <ellipse class="cheek" cx="35" cy="77" rx="8" ry="5" />
    <ellipse class="cheek" cx="85" cy="77" rx="8" ry="5" />
    <path class="line" d="M40 69q5-7 10 0M70 69q5-7 10 0" stroke-width="2.6" />
    <ellipse class="ink" cx="60" cy="72" rx="3" ry="2.2" />
    <path class="tongue" d="M52 77q8 11 16 0z" stroke-width="2" />
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;
</style>
