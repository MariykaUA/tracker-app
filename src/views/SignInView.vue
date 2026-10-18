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
    await auth.signIn(username.value, password.value)
    await router.replace({ name: 'home' })
  } catch (error) {
    if (error instanceof AuthError && error.code === 'bad-username') {
      usernameError.value = AUTH_ERROR_MESSAGES['bad-username']
      await nextTick()
      usernameField.value?.focus()
    } else if (error instanceof AuthError && error.code === 'wrong-login') {
      passwordError.value = AUTH_ERROR_MESSAGES['wrong-login']
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
    title="Welcome back"
    lead="Sign in to see your week."
    submit-label="Sign in"
    :busy="busy"
    switch-text="New here?"
    switch-label="Create an account"
    :switch-to="{ name: 'create-account' }"
    @submit="submit"
  >
    <BaseField
      ref="usernameField"
      v-model="username"
      label="Username"
      autocomplete="username"
      :error="usernameError"
    />
    <BaseField
      ref="passwordField"
      v-model="password"
      label="Password"
      autocomplete="current-password"
      password
      :error="passwordError"
    />
    <p v-if="formError" role="alert" class="sign-in__error">{{ formError }}</p>
  </AuthScreen>
</template>

<style scoped lang="scss">
.sign-in__error {
  color: $color-ink;
  @include type('small');
}
</style>
