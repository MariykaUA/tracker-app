import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

// Resolves with the user ID; signs in anonymously only if there's no session yet
export function ensureUser(): Promise<string> {
  return new Promise((resolve, reject) => {
    const stop = onAuthStateChanged(auth, async (user) => {
      stop()
      try {
        resolve(user ? user.uid : (await signInAnonymously(auth)).user.uid)
      } catch (error) {
        reject(error)
      }
    })
  })
}
