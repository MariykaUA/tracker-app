import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import * as authService from '@/services/auth.service'
import { useEntriesStore } from './entries.store'
import type { NewAccount } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const uid = ref<string | null>(null)
  const name = ref('')
  const isAnonymous = ref(false)
  let ready: Promise<void> | undefined

  // An anonymous session from before login doesn't count: it has to create an account
  const isSignedIn = computed(() => uid.value !== null && !isAnonymous.value)

  // Another account's entries never stay in the cache
  function setUser(user: User | null): void {
    if (uid.value && user?.uid !== uid.value) useEntriesStore().clear()
    uid.value = user?.uid ?? null
    isAnonymous.value = user?.isAnonymous ?? false
  }

  // The name loads in the background: offline, Firestore can take a while to give up
  function fetchName(): void {
    const current = uid.value
    if (!current || isAnonymous.value) return

    authService
      .loadName(current)
      .then((loaded) => {
        if (uid.value === current) name.value = loaded
      })
      .catch((error: unknown) => console.error(error))
  }

  // Restores the saved session once; main.ts and the router guard both wait for it
  function init(): Promise<void> {
    ready ??= authService.getCurrentUser().then((user) => {
      setUser(user)
      fetchName()
    })
    return ready
  }

  async function signIn(username: string, password: string): Promise<void> {
    setUser(await authService.signIn(username, password))
    name.value = ''
    fetchName()
  }

  async function createAccount(account: NewAccount): Promise<void> {
    setUser(await authService.createAccount(account))
    name.value = account.name.trim()
  }

  // No UI yet (not designed); the router guard sends the next navigation to /sign-in
  async function signOut(): Promise<void> {
    await authService.signOut()
    setUser(null)
    name.value = ''
  }

  return { uid, name, isSignedIn, init, signIn, createAccount, signOut }
})
