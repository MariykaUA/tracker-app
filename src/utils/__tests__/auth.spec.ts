import { describe, expect, it } from 'vitest'
import {
  emailToUsername,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
  usernameToEmail,
} from '../auth'

describe('normalizeUsername', () => {
  it('trims and lowercases', () => {
    expect(normalizeUsername('  Mariia ')).toBe('mariia')
  })
})

describe('isValidUsername', () => {
  it('takes 3–20 letters or numbers, in any case', () => {
    expect(isValidUsername('abc')).toBe(true)
    expect(isValidUsername('Mariia7')).toBe(true)
    expect(isValidUsername('a'.repeat(20))).toBe(true)
  })

  it('refuses too short, too long and other characters', () => {
    expect(isValidUsername('ab')).toBe(false)
    expect(isValidUsername('a'.repeat(21))).toBe(false)
    expect(isValidUsername('mari ia')).toBe(false)
    expect(isValidUsername('mariia@x')).toBe(false)
    expect(isValidUsername('')).toBe(false)
  })

  it('ignores spaces around it', () => {
    expect(isValidUsername('  abc  ')).toBe(true)
  })
})

describe('isValidPassword', () => {
  it('needs at least 6 characters', () => {
    expect(isValidPassword('12345')).toBe(false)
    expect(isValidPassword('tulip7')).toBe(true)
  })
})

describe('usernameToEmail', () => {
  it('maps the normalized username to the internal address', () => {
    expect(usernameToEmail(' Mariia ')).toBe('mariia@tracker-app.vercel.app')
  })
})

describe('emailToUsername', () => {
  it('gives back the username', () => {
    expect(emailToUsername('mariia@tracker-app.vercel.app')).toBe('mariia')
  })
})
