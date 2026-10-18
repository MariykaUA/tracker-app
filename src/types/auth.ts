// What went wrong when signing in or creating an account (messages in constants/auth.ts)
export type AuthErrorCode =
  | 'username-taken'
  | 'wrong-login'
  | 'bad-username'
  | 'short-password'
  | 'offline'

// users/{uid}: who the account belongs to, next to its list of years
export interface UserProfile {
  name: string
  username: string
}

export interface NewAccount extends UserProfile {
  password: string
}
