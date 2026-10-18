<!-- Pebble looking at an empty box: a day with nothing logged (Character sheet: "Wondering") -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="150" height="114" viewBox="0 0 170 130">
    <rect class="box" x="112" y="14" width="40" height="40" rx="12" />
    <g transform="translate(8 10)">
      <ellipse class="body" cx="60" cy="100" rx="28" ry="16" />
      <ellipse class="ears" cx="22" cy="66" rx="12" ry="23" transform="rotate(12 22 66)" />
      <ellipse class="ears" cx="98" cy="62" rx="12" ry="23" transform="rotate(-26 98 62)" />
      <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
      <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
      <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
      <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
      <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
      <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
      <circle class="ink" cx="48" cy="65" r="3.2" />
      <circle class="ink" cx="78" cy="65" r="3.2" />
      <ellipse class="ink" cx="63" cy="71" rx="3" ry="2.2" />
      <circle class="ink" cx="63" cy="79" r="2.4" />
      <ellipse class="paw" cx="47" cy="111" rx="9" ry="5.5" />
      <ellipse class="paw" cx="73" cy="111" rx="9" ry="5.5" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.box {
  fill: none;
  stroke: $pebble-ears;
  stroke-width: 2.5;
  stroke-dasharray: 6 6;
  stroke-linecap: round;
}

.paw {
  fill: $pebble-shine;
  opacity: 0.85;
}
</style>
