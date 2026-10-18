<!-- Pebble with its paws up: the Done screen (Character sheet: "Celebrating") -->
<template>
  <svg class="motion-bob" aria-hidden="true" width="190" height="190" viewBox="0 0 120 120">
    <ellipse class="body" cx="18" cy="52" rx="8" ry="14" transform="rotate(-38 18 52)" />
    <ellipse class="body" cx="102" cy="52" rx="8" ry="14" transform="rotate(38 102 52)" />
    <ellipse class="body" cx="60" cy="100" rx="28" ry="16" />
    <ellipse class="ears" cx="22" cy="72" rx="11" ry="22" transform="rotate(14 22 72)" />
    <ellipse class="ears" cx="98" cy="72" rx="11" ry="22" transform="rotate(-14 98 72)" />
    <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
    <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
    <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
    <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
    <ellipse class="cheek" cx="35" cy="77" rx="8" ry="5" />
    <ellipse class="cheek" cx="85" cy="77" rx="8" ry="5" />
    <path class="line" d="M40 69q5-7 10 0M70 69q5-7 10 0" stroke-width="2.6" />
    <ellipse class="ink" cx="60" cy="72" rx="3" ry="2.2" />
    <path class="tongue" d="M52 77q8 11 16 0z" stroke-width="2" />
    <ellipse class="paw" cx="47" cy="111" rx="9" ry="5.5" />
    <ellipse class="paw" cx="73" cy="111" rx="9" ry="5.5" />
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.paw {
  fill: $pebble-shine;
  opacity: 0.85;
}
</style>
