<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import AuthScreen from '@/components/auth/AuthScreen.vue'
import BaseField from '@/components/base/BaseField.vue'
import { AUTH_ERROR_MESSAGES } from '@/constants/auth'
import { AuthError } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { isValidPassword, isValidUsername } from '@/utils/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const username = ref('')
const password = ref('')
const usernameError = ref<string>()
const passwordError = ref<string>()
const formError = ref<string>()
const busy = ref(false)

const usernameField = useTemplateRef<InstanceType<typeof BaseField>>('usernameField')
const passwordField = useTemplateRef<InstanceType<typeof BaseField>>('passwordField')

// An error goes away as soon as its field is edited
watch(username, () => (usernameError.value = undefined))
watch(password, () => (passwordError.value = undefined))

async function submit(): Promise<void> {
  if (busy.value) return
  formError.value = undefined
  usernameError.value = isValidUsername(username.value)
    ? undefined
    : AUTH_ERROR_MESSAGES['bad-username']
  passwordError.value = isValidPassword(password.value)
    ? undefined
    : AUTH_ERROR_MESSAGES['short-password']

  // Focus on the first wrong field reads out its error
  await nextTick()
  if (usernameError.value) return usernameField.value?.focus()
  if (passwordError.value) return passwordField.value?.focus()

  busy.value = true
  try {
    // An anonymous session from before login keeps its entries (see auth.service)
    await auth.createAccount({ name: name.value, username: username.value, password: password.value })
    await router.replace({ name: 'home' })
  } catch (error) {
    if (
      error instanceof AuthError &&
      (error.code === 'username-taken' || error.code === 'bad-username')
    ) {
      usernameError.value = AUTH_ERROR_MESSAGES[error.code]
      await nextTick()
      usernameField.value?.focus()
    } else if (error instanceof AuthError && error.code === 'short-password') {
      passwordError.value = AUTH_ERROR_MESSAGES['short-password']
      await nextTick()
      passwordField.value?.focus()
    } else {
      if (!(error instanceof AuthError)) console.error(error)
      formError.value = AUTH_ERROR_MESSAGES.offline
    }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AuthScreen
    title="Make it yours"
    lead="Create an account so your days stay yours."
    submit-label="Create account"
    :busy="busy"
    switch-text="Have an account?"
    switch-label="Sign in"
    :switch-to="{ name: 'sign-in' }"
    @submit="submit"
  >
    <BaseField
      v-model="name"
      label="Your name"
      autocomplete="given-name"
      hint="Shown on your home screen"
    />
    <BaseField
      ref="usernameField"
      v-model="username"
      label="Username"
      autocomplete="username"
      hint="Letters and numbers. You sign in with it."
      :error="usernameError"
    />
    <BaseField
      ref="passwordField"
      v-model="password"
      label="Password"
      autocomplete="new-password"
      hint="At least 6 characters"
      password
      :error="passwordError"
    />
    <p v-if="formError" role="alert" class="create-account__error">{{ formError }}</p>
  </AuthScreen>
</template>

<style scoped lang="scss">
.create-account__error {
  color: $color-ink;
  @include type('small');
}
</style>
