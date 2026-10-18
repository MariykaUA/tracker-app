<!-- Pebble asleep under the moon: the sleep check-in (Character sheet: "Sleeping") -->
<template>
  <svg class="motion-fade" aria-hidden="true" width="176" height="120" viewBox="0 0 176 120">
    <path class="night" d="M36 16a17 17 0 1 0 16 26a14 14 0 0 1-16-26z" />
    <circle class="night" cx="66" cy="20" r="2.5" />
    <circle class="night" cx="20" cy="56" r="2" />
    <circle class="night" cx="150" cy="30" r="2" />
    <ellipse class="hill" cx="96" cy="104" rx="62" ry="16" />
    <g class="motion-breathe">
      <g transform="translate(36 6)">
        <ellipse class="ears" cx="22" cy="70" rx="12" ry="23" transform="rotate(30 22 70)" />
        <ellipse class="ears" cx="98" cy="70" rx="12" ry="23" transform="rotate(-30 98 70)" />
        <ellipse class="body" cx="60" cy="66" rx="41" ry="35" />
        <ellipse class="shine" cx="44" cy="47" rx="15" ry="7" transform="rotate(-18 44 47)" />
        <ellipse class="cap" cx="62" cy="32" rx="18" ry="9" transform="rotate(-6 62 32)" />
        <ellipse class="cap-shine" cx="56" cy="29" rx="7" ry="2.5" transform="rotate(-6 56 29)" />
        <ellipse class="cheek" cx="35" cy="77" rx="7" ry="4.5" />
        <ellipse class="cheek" cx="85" cy="77" rx="7" ry="4.5" />
        <path class="line" d="M40 67q5 5 10 0M70 67q5 5 10 0" stroke-width="2.4" />
        <ellipse class="ink" cx="60" cy="72" rx="3" ry="2.2" />
        <circle class="ink" cx="60" cy="80" r="2.4" />
      </g>
    </g>
    <path class="motion-bob snore" d="M140 44h9l-9 10h9M156 26h7l-7 8h7" stroke-width="2.2" />
  </svg>
</template>

<style scoped lang="scss">
@include pebble-paint;

.night {
  fill: $pebble-shine;
}

.hill {
  fill: $scene-teal;
}

.snore {
  fill: none;
  stroke: $scene-cyan;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
