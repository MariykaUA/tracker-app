<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import GlassCard from '@/components/base/GlassCard.vue'
import BackLink from '@/components/layout/BackLink.vue'
import PebbleWaving from '@/components/mascot/PebbleWaving.vue'
import { useAuthStore } from '@/stores/auth.store'

// Account (artboard 21): who's signed in, Sign out, and the way to delete the account
const auth = useAuthStore()
const router = useRouter()
const isSigningOut = ref(false)

async function signOut(): Promise<void> {
  if (isSigningOut.value) return
  isSigningOut.value = true
  try {
    await auth.signOut()
    await router.replace({ name: 'sign-in' })
  } catch (error) {
    console.error(error)
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <div class="account">
    <BackLink :to="{ name: 'home' }" />

    <div class="account__header motion-rise">
      <h1 tabindex="-1" class="account__title">Your account</h1>
      <PebbleWaving small />
    </div>

    <GlassCard low aria-label="Account details" class="motion-rise">
      <dl class="account__details">
        <div v-if="auth.name" class="account__detail">
          <dt class="account__term">Name</dt>
          <dd class="account__value">{{ auth.name }}</dd>
        </div>
        <div class="account__detail">
          <dt class="account__term">Username</dt>
          <dd class="account__value">{{ auth.username }}</dd>
        </div>
      </dl>
      <BaseButton variant="light" :busy="isSigningOut" @click="signOut">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" class="account__icon">
          <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
          <path d="M10 16l-4-4l4-4M6 12h10" />
        </svg>
        <span>Sign out</span>
      </BaseButton>
    </GlassCard>

    <GlassCard low aria-labelledby="account-delete" class="account__danger motion-rise">
      <div class="account__danger-text">
        <h2 id="account-delete" class="account__subtitle">Delete account</h2>
        <p class="account__note">
          Removes your account and every day you've logged. This can't be undone.
        </p>
      </div>
      <BaseButton variant="light" :to="{ name: 'account-delete' }" class="account__delete">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" class="account__icon">
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
        </svg>
        <span>Delete account</span>
      </BaseButton>
    </GlassCard>
  </div>
</template>

<style scoped lang="scss">
.account {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-height: 100%;
  padding: $space-page-top $space-4 34px;
}

.account__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  padding: 0 $space-1;
}

.account__title {
  @include type('title');
}

.account__details {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.account__detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account__term {
  color: $color-ink-soft;
  @include type('eyebrow');
}

.account__value {
  overflow-wrap: anywhere;
  @include type('detail');
}

.account__icon {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

// Sits at the bottom of the screen, as in the prototype
.account__danger {
  margin-top: auto;
}

.account__danger-text {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.account__subtitle {
  @include type('heading');
  font-weight: 600;
  line-height: 1.5rem;
}

.account__note {
  color: $color-ink-soft;
  @include type('small');
}

.account__delete {
  color: $color-danger;
}
</style>
