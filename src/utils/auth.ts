import { PASSWORD_MIN_LENGTH, USERNAME_DOMAIN, USERNAME_PATTERN } from '@/constants/auth'

// "  Mariia " → "mariia": usernames are case-insensitive and ignore stray spaces
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(normalizeUsername(username))
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH
}

// The username back from the account's internal address
export function emailToUsername(email: string): string {
  return email.slice(0, email.lastIndexOf('@'))
}

// The Firebase Email/Password address behind a username, never shown
export function usernameToEmail(username: string): string {
  return `${normalizeUsername(username)}@${USERNAME_DOMAIN}`
}
