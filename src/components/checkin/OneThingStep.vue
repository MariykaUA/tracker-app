<script setup lang="ts">
import { useId } from 'vue'
import CheckinQuestion from './CheckinQuestion.vue'
import { MAX_ONE_THING } from '@/utils/checkin'

// Check-in 6: the one thing worth celebrating, in a few words
const imp = defineModel<string>({ required: true })

// The prototype has no separate label: the question itself is the field's
// visible label, and the line under it is its description
const titleId = useId()
const hintId = useId()
</script>

<template>
  <CheckinQuestion title="What made today count?" :title-id="titleId">
    <div class="one-thing-step">
      <textarea
        v-model="imp"
        class="one-thing-step__field"
        rows="4"
        :maxlength="MAX_ONE_THING"
        placeholder="A walk, a call, a small win…"
        :aria-labelledby="titleId"
        :aria-describedby="hintId"
      ></textarea>
      <p :id="hintId" class="one-thing-step__hint">It can be tiny. It still counts.</p>
    </div>
  </CheckinQuestion>
</template>

<style scoped lang="scss">
.one-thing-step {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.one-thing-step__field {
  display: block;
  width: 100%;
  min-height: 132px;
  padding: 14px $space-4;
  border: $border-card;
  border-radius: $radius-row;
  background: $color-sunken;
  box-shadow: $shadow-pressed;
  color: $color-ink;
  resize: none;
  @include type('button');
  font-weight: 700;
  line-height: 1.5rem;

  &::placeholder {
    color: $color-ink-soft;
    opacity: 0.85;
  }
}

.one-thing-step__hint {
  margin-top: $space-1;
  color: $color-ink-soft;
  text-align: center;
  @include type('label');
}
</style>
