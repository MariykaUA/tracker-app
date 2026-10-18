import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Unsubscribe,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { deleteUserData } from './entries.service'
import { normalizeUsername, usernameToEmail } from '@/utils/auth'
import type { AuthErrorCode, NewAccount, UserProfile } from '@/types/auth'

// A sign-in or account error the screens know how to explain
export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
  }
}

const FIREBASE_CODES: Record<string, AuthErrorCode> = {
  'auth/email-already-in-use': 'username-taken',
  'auth/credential-already-in-use': 'username-taken',
  'auth/invalid-credential': 'wrong-login',
  'auth/invalid-login-credentials': 'wrong-login',
  'auth/wrong-password': 'wrong-login',
  'auth/user-not-found': 'wrong-login',
  'auth/invalid-email': 'bad-username',
  'auth/weak-password': 'short-password',
  'auth/network-request-failed': 'offline',
}

// Known Firebase errors become an AuthError; anything else is passed on as it is
function toAuthError(error: unknown): unknown {
  const code = error instanceof FirebaseError ? FIREBASE_CODES[error.code] : undefined
  return code ? new AuthError(code) : error
}

const userRef = (uid: string) => doc(db, 'users', uid)

// Calls back with the current user (anonymous or not, or null): first once the
// saved session is restored, then on every sign-in and sign-out, in any tab
export function watchUser(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}

// The name shown on Home, '' if the account has none yet
export async function loadName(uid: string): Promise<string> {
  const snap = await getDoc(userRef(uid))
  return (snap.data() as Partial<UserProfile> | undefined)?.name ?? ''
}

export async function signIn(username: string, password: string): Promise<User> {
  try {
    return (await signInWithEmailAndPassword(auth, usernameToEmail(username), password)).user
  } catch (error) {
    throw toAuthError(error)
  }
}

// An anonymous session from before login is upgraded in place, so its uid and
// entries are kept; otherwise a new account is made
export async function createAccount({ name, username, password }: NewAccount): Promise<User> {
  const email = usernameToEmail(username)

  try {
    // Only an anonymous session is linked; a signed-in account is never touched
    const current = auth.currentUser
    const { user } = current?.isAnonymous
      ? await linkWithCredential(current, EmailAuthProvider.credential(email, password))
      : await createUserWithEmailAndPassword(auth, email, password)

    // merge: true keeps the years list an upgraded account already has
    const profile: UserProfile = { name: name.trim(), username: normalizeUsername(username) }
    await setDoc(userRef(user.uid), profile, { merge: true })
    return user
  } catch (error) {
    throw toAuthError(error)
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

// Deleting needs a recent login, so the password is checked again first; a
// wrong one or no connection stops it before anything is deleted. Then the
// data, then the Auth user: once that's gone the rules no longer allow the rest.
export async function deleteAccount(password: string): Promise<void> {
  const user = auth.currentUser
  if (!user?.email) throw new Error('Not signed in')

  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password))
    await deleteUserData(user.uid)
    await deleteUser(user)
  } catch (error) {
    throw toAuthError(error)
  }
}
