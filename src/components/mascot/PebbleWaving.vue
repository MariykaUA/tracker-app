<!-- Pebble waving one ear beside a star: Sign in, Create an account, and smaller on Account -->
<script setup lang="ts">
withDefaults(defineProps<{ small?: boolean }>(), { small: false })
</script>

<template>
  <svg
    class="motion-bob"
    aria-hidden="true"
    :width="small ? 92 : 132"
    :height="small ? 81 : 116"
    viewBox="4 6 120 106"
  >
    <circle class="sparkle" cx="16" cy="30" r="3" />
    <circle class="sparkle" cx="116" cy="96" r="2.5" />
    <path
      class="star"
      d="M14 52l2.4 5l5 .6l-3.8 3.4l1 5l-4.6-2.6l-4.6 2.6l1-5l-3.8-3.4l5-.6z"
    />
    <ellipse class="ears" cx="22" cy="64" rx="12" ry="23" transform="rotate(16 22 64)" />
    <g class="motion-sway wave">
      <ellipse class="ears" cx="104" cy="38" rx="12" ry="23" transform="rotate(32 104 38)" />
    </g>
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

.sparkle {
  fill: $pebble-shine;
}

.star {
  fill: $scene-star;
  stroke: $pebble-ink;
  stroke-width: 1.6;
  stroke-linejoin: round;
}

// The ear swings from its own base, as in the prototype
.wave {
  transform-box: fill-box;
}
</style>
