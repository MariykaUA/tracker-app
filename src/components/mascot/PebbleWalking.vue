<!-- Pebble out walking in its sneakers: the steps check-in (Character sheet: "Walking") -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="176" height="120" viewBox="0 0 176 120">
    <ellipse class="leaf" cx="22" cy="100" rx="7" ry="4" transform="rotate(-20 22 100)" />
    <ellipse class="leaf" cx="40" cy="88" rx="7" ry="4" transform="rotate(-20 40 88)" />
    <ellipse class="leaf leaf--pink" cx="18" cy="76" rx="6" ry="3.5" transform="rotate(-20 18 76)" />
    <g class="motion-sway">
      <g transform="translate(40 2)">
        <ellipse class="body" cx="60" cy="98" rx="27" ry="16" />
        <ellipse class="ears" cx="22" cy="62" rx="12" ry="23" transform="rotate(28 22 62)" />
        <ellipse class="ears" cx="98" cy="62" rx="12" ry="23" transform="rotate(-4 98 62)" />
        <ellipse class="body" cx="60" cy="62" rx="41" ry="35" />
        <ellipse class="shine" cx="44" cy="43" rx="15" ry="7" transform="rotate(-18 44 43)" />
        <ellipse class="cap" cx="62" cy="28" rx="18" ry="9" transform="rotate(-6 62 28)" />
        <ellipse class="cap-shine" cx="56" cy="25" rx="7" ry="2.5" transform="rotate(-6 56 25)" />
        <ellipse class="cheek" cx="35" cy="73" rx="7" ry="4.5" />
        <ellipse class="cheek" cx="85" cy="73" rx="7" ry="4.5" />
        <circle class="ink" cx="45" cy="63" r="3.2" />
        <circle class="ink" cx="75" cy="63" r="3.2" />
        <ellipse class="ink" cx="60" cy="68" rx="3" ry="2.2" />
        <path class="line" d="M53 73q3.5 4 7 0q3.5 4 7 0" stroke-width="2.2" />
        <path class="shoe" d="M30 112c0-5 3-8 7-8c3 0 4 2 7 2l8 4c3 1 5 2 5 5v1H30z" />
        <path class="shoe" d="M64 108c0-5 3-8 7-8c3 0 4 2 7 2l8 4c3 1 5 2 5 5v1H64z" />
      </g>
    </g>
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.leaf {
  fill: $scene-orchid;
}

.leaf--pink {
  fill: $scene-pink;
}

.shoe {
  fill: $pebble-shine;
  stroke: $pebble-ink;
  stroke-width: 2;
  stroke-linejoin: round;
}
</style>
