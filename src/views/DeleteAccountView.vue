<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseField from '@/components/base/BaseField.vue'
import GlassCard from '@/components/base/GlassCard.vue'
import BackLink from '@/components/layout/BackLink.vue'
import PebbleWorried from '@/components/mascot/PebbleWorried.vue'
import { DELETE_ACCOUNT_MESSAGES } from '@/constants/auth'
import { AuthError } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useStatusStore } from '@/stores/status.store'

// Delete account (artboard 22): the password confirms it, then everything goes
const auth = useAuthStore()
const status = useStatusStore()
const router = useRouter()

const password = ref('')
const passwordError = ref<string>()
const formError = ref<string>()
const isDeleting = ref(false)
const passwordField = useTemplateRef<InstanceType<typeof BaseField>>('passwordField')

watch(password, () => (passwordError.value = undefined))

async function showPasswordError(message: string): Promise<void> {
  passwordError.value = message
  await nextTick()
  passwordField.value?.focus()
}

async function remove(): Promise<void> {
  if (isDeleting.value) return
  formError.value = undefined
  if (!password.value) return showPasswordError(DELETE_ACCOUNT_MESSAGES.noPassword)

  isDeleting.value = true
  try {
    await auth.deleteAccount(password.value)
    await router.replace({ name: 'sign-in' })
    await status.announce(DELETE_ACCOUNT_MESSAGES.deleted)
  } catch (error) {
    if (error instanceof AuthError && error.code === 'wrong-login') {
      await showPasswordError(DELETE_ACCOUNT_MESSAGES.wrongPassword)
    } else {
      if (!(error instanceof AuthError && error.code === 'offline')) console.error(error)
      formError.value = DELETE_ACCOUNT_MESSAGES.offline
    }
  } finally {
    isDeleting.value = false
  }
}

function keep(): void {
  if (!isDeleting.value) void router.push({ name: 'account' })
}
</script>

<template>
  <div class="delete-account">
    <BackLink :to="{ name: 'account' }" />

    <div class="delete-account__header motion-rise">
      <PebbleWorried />
      <h1 tabindex="-1" class="delete-account__title">Delete your account?</h1>
      <p class="delete-account__lead">Every day you've logged will be gone for good.</p>
    </div>

    <GlassCard
      as="form"
      low
      novalidate
      class="delete-account__form motion-rise"
      :aria-busy="isDeleting"
      @submit.prevent="remove"
    >
      <ul class="delete-account__list">
        <li>Sleep, steps, mood, anxiety and crying</li>
        <li>Every "one thing" you wrote</li>
        <li>Your name and username</li>
      </ul>
      <BaseField
        ref="passwordField"
        v-model="password"
        label="Your password"
        autocomplete="current-password"
        hint="Type it to confirm it's really you."
        password
        :error="passwordError"
      />
      <p v-if="formError" role="alert" class="delete-account__error">{{ formError }}</p>
      <div class="delete-account__actions">
        <BaseButton type="submit" variant="danger" :busy="isDeleting">
          {{ isDeleting ? 'Deleting…' : 'Delete forever' }}
        </BaseButton>
        <BaseButton variant="light" :busy="isDeleting" @click="keep">Keep my account</BaseButton>
      </div>
    </GlassCard>
  </div>
</template>

<style scoped lang="scss">
.delete-account {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-height: 100%;
  padding: $space-page-top $space-4 34px;
}

.delete-account__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
}

.delete-account__title {
  text-align: center;
  @include type('title');
}

.delete-account__lead {
  color: $color-ink-soft;
  text-align: center;
  @include type('body');
  font-weight: 700;
}

// Fills the screen like the prototype, but grows rather than squashing
.delete-account__form {
  flex: 1 0 auto;
}

.delete-account__list {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  padding-left: $space-5;
  list-style: disc;
  @include type('body');
  font-weight: 700;
}

.delete-account__error {
  color: $color-ink;
  @include type('small');
}

.delete-account__actions {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: auto;
}
</style>
