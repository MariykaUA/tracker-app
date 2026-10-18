import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import * as authService from '@/services/auth.service'
import { emailToUsername } from '@/utils/auth'
import type { NewAccount } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const uid = ref<string | null>(null)
  const name = ref('')
  const username = ref('') // from the account's internal address, so it needs no load
  const isAnonymous = ref(false)
  let ready: Promise<void> | undefined

  // An anonymous session from before login doesn't count: it has to create an account
  const isSignedIn = computed(() => uid.value !== null && !isAnonymous.value)

  // Every auth change comes through here. A new uid starts with no name until
  // its own loads; the entries store resets itself on the change (its uid watch).
  function setUser(user: User | null): void {
    const changed = (user?.uid ?? null) !== uid.value

    uid.value = user?.uid ?? null
    isAnonymous.value = user?.isAnonymous ?? false
    username.value = user?.email ? emailToUsername(user.email) : ''
    if (changed) {
      name.value = ''
      fetchName()
    }
  }

  // The name loads in the background: offline, Firestore can take a while to give
  // up. A name set meanwhile (a new account) or another account's name never wins.
  function fetchName(): void {
    const current = uid.value
    if (!current || isAnonymous.value) return

    authService
      .loadName(current)
      .then((loaded) => {
        if (uid.value === current && !name.value) name.value = loaded
      })
      .catch((error: unknown) => console.error(error))
  }

  // Follows Firebase for the whole app life, so a sign-in or sign-out anywhere
  // (another tab too) updates uid, name and isSignedIn. Resolves on the first
  // call, once the saved session is restored; main.ts and the router guard wait for it.
  function init(): Promise<void> {
    ready ??= new Promise((resolve) => {
      authService.watchUser((user) => {
        setUser(user)
        resolve()
      })
    })
    return ready
  }

  // The listener sees these too; setting the user here as well means the state
  // is right as soon as the call returns, before the router moves on
  async function signIn(username: string, password: string): Promise<void> {
    setUser(await authService.signIn(username, password))
  }

  // Linking an anonymous session keeps its uid, and Firebase reports no auth
  // change for it, so isSignedIn flips here
  async function createAccount(account: NewAccount): Promise<void> {
    setUser(await authService.createAccount(account))
    name.value = account.name.trim()
  }

  // The entries store resets itself when uid goes back to null (its uid watch)
  async function signOut(): Promise<void> {
    await authService.signOut()
    setUser(null)
  }

  async function deleteAccount(password: string): Promise<void> {
    await authService.deleteAccount(password)
    setUser(null)
  }

  return { uid, name, username, isSignedIn, init, signIn, createAccount, signOut, deleteAccount }
})
