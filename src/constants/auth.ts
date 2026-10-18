import type { AuthErrorCode } from '@/types/auth'

// Usernames sign in through Firebase Email/Password as `${username}@${USERNAME_DOMAIN}`.
// The address is internal only and never shown.
export const USERNAME_DOMAIN = 'tracker-app.vercel.app'

export const USERNAME_PATTERN = /^[a-z0-9]{3,20}$/
export const PASSWORD_MIN_LENGTH = 6

// Delete account (artboard 22): errors under the password field, and the
// message announced once the account is gone
export const DELETE_ACCOUNT_MESSAGES = {
  noPassword: 'Type your password to confirm.',
  wrongPassword: "That password isn't right.",
  offline: "Couldn't connect. Nothing was deleted.",
  deleted: 'Your account was deleted.',
} as const

// Shown as text under the field the error belongs to
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  'username-taken': 'That username is taken. Try another one.',
  'wrong-login': 'Wrong username or password.',
  'bad-username': 'Use 3–20 letters or numbers.',
  'short-password': 'Use at least 6 characters.',
  offline: "Couldn't connect. Check your internet and try again.",
}
