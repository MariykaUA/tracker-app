import { describe, expect, it } from 'vitest'
import { canContinue, draftFrom, firstGap, hasAnswer, isComplete, stepValues } from '../checkin'
import type { Entry } from '@/types/entry'

const day = (values: Partial<Entry> = {}): Entry => ({
  date: '2026-10-08',
  year: 2026,
  month: 10,
  ...values,
})

const full = day({ hours: 7.5, rested: 4, steps: 6400, mood: 'good', anx: 'mild', cry: 'none' })

describe('firstGap', () => {
  it('starts at sleep on an empty day', () => {
    expect(firstGap(undefined)).toBe(0)
    expect(firstGap(day())).toBe(0)
  })

  it('opens on the first tracker not logged yet', () => {
    expect(firstGap(day({ hours: 8, rested: 3, steps: 4000 }))).toBe(2)
    expect(firstGap(day({ hours: 8, rested: 3, steps: 0, mood: 'okay', anx: 'calm' }))).toBe(4)
  })

  it('starts at the beginning again when everything is logged', () => {
    expect(firstGap(full)).toBe(0)
  })
})

describe('isComplete', () => {
  it('needs all five trackers, not the one thing', () => {
    expect(isComplete(full)).toBe(true)
    expect(isComplete(day({ ...full, cry: undefined }))).toBe(false)
    expect(isComplete(undefined)).toBe(false)
  })
})

describe('draftFrom', () => {
  it('starts an empty day at the sleep goal, feeling okay', () => {
    expect(draftFrom(undefined)).toEqual({
      hours: 8,
      rested: 3,
      steps: '',
      mood: null,
      anx: null,
      cry: null,
      imp: '',
    })
  })

  it('fills the form from a saved day', () => {
    expect(draftFrom({ ...full, imp: 'A walk' })).toMatchObject({
      hours: 7.5,
      rested: 4,
      steps: '6400',
      mood: 'good',
      imp: 'A walk',
    })
  })

  it('keeps zero steps as "0", not an empty field', () => {
    expect(draftFrom(day({ steps: 0 })).steps).toBe('0')
  })
})

describe('canContinue', () => {
  const empty = draftFrom(undefined)

  it('always allows sleep and the one thing', () => {
    expect(canContinue(0, empty)).toBe(true)
    expect(canContinue(5, empty)).toBe(true)
  })

  it('waits for steps and for each choice', () => {
    expect(canContinue(1, empty)).toBe(false)
    expect(canContinue(1, { ...empty, steps: '0' })).toBe(true)
    expect(canContinue(2, empty)).toBe(false)
    expect(canContinue(2, { ...empty, mood: 'okay' })).toBe(true)
    expect(canContinue(3, { ...empty, anx: 'calm' })).toBe(true)
    expect(canContinue(4, { ...empty, cry: 'some' })).toBe(true)
  })
})

describe('stepValues', () => {
  const draft = { ...draftFrom(full), imp: '  An hour outside  ' }

  it('saves only the fields of the step being left', () => {
    expect(stepValues(0, draft)).toEqual({ hours: 7.5, rested: 4 })
    expect(stepValues(1, draft)).toEqual({ steps: 6400 })
    expect(stepValues(2, draft)).toEqual({ mood: 'good' })
    expect(stepValues(3, draft)).toEqual({ anx: 'mild' })
    expect(stepValues(4, draft)).toEqual({ cry: 'none' })
  })

  it('trims the one thing', () => {
    expect(stepValues(5, draft)).toEqual({ imp: 'An hour outside' })
  })
})

describe('hasAnswer', () => {
  it('checks the tracker behind a question', () => {
    expect(hasAnswer(0, full)).toBe(true)
    expect(hasAnswer(2, day({ hours: 8 }))).toBe(false)
    expect(hasAnswer(1, undefined)).toBe(false)
  })

  it('needs written text for the one thing', () => {
    expect(hasAnswer(5, full)).toBe(false)
    expect(hasAnswer(5, day({ imp: 'A walk' }))).toBe(true)
    expect(hasAnswer(5, day({ imp: '' }))).toBe(false)
  })
})
