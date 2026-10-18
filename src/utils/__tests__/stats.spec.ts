import { describe, expect, it } from 'vitest'
import { summarize, summaryValue } from '../stats'
import type { Entry } from '@/types/entry'

const day = (date: string, values: Partial<Entry>): Entry => ({
  date,
  year: 2026,
  month: 10,
  ...values,
})

// The prototype's 5 to 7 October
const week: (Entry | undefined)[] = [
  day('2026-10-05', { hours: 7, rested: 3, steps: 6800, mood: 'good', anx: 'mild', cry: 'none' }),
  day('2026-10-06', { hours: 6.5, rested: 3, steps: 12100, anx: 'high', cry: 'some' }),
  day('2026-10-07', { hours: 8, rested: 4, steps: 7400, mood: 'great', anx: 'calm', cry: 'none' }),
  undefined,
]

describe('summaryValue', () => {
  it('says "Not yet" when nothing is logged', () => {
    expect(summaryValue('sleep', [undefined, undefined])).toBe('Not yet')
    expect(summaryValue('mood', [day('2026-10-06', { hours: 8 })])).toBe('Not yet')
  })

  it('averages sleep to one decimal', () => {
    expect(summaryValue('sleep', week)).toBe('7.2 h')
  })

  it('averages steps with thousands separators', () => {
    expect(summaryValue('steps', week)).toBe('8,767')
  })

  it('names the typical mood and anxiety, skipping days without one', () => {
    expect(summaryValue('mood', week)).toBe('Great')
    expect(summaryValue('anxiety', week)).toBe('Mild')
  })

  it('counts the days with tears', () => {
    expect(summaryValue('crying', week)).toBe('1 day')
    expect(summaryValue('crying', [week[1], week[1]])).toBe('2 days')
    expect(summaryValue('crying', [week[0]])).toBe('No tears')
  })
})

describe('summarize', () => {
  it('gives sleep the week view stats of the Sleep week artboard', () => {
    expect(summarize('sleep', week)).toMatchObject({
      stat1: 'Average slept',
      stat1Value: '7.2 h',
      stat2: 'Felt on average',
      stat2Value: 'Okay',
      weekNote: 'Goal 8 h',
    })
  })

  it('counts goal days, calm days and days with tears out of the days logged', () => {
    expect(summarize('steps', week).stat2Value).toBe('0 of 3')
    expect(summarize('anxiety', week).stat2Value).toBe('1 of 3')
    expect(summarize('crying', week).stat1Value).toBe('1 of 3')
  })

  it('counts mood notes on every day, even without a mood', () => {
    const notes = [
      day('2026-10-01', { mood: 'good', note: 'Long walk' }),
      day('2026-10-02', { note: 'Slept badly' }),
      day('2026-10-03', { mood: 'okay' }),
    ]
    expect(summarize('mood', notes).stat2Value).toBe('2')
  })

  it('says "Not yet" for every value of an empty span', () => {
    expect(summarize('steps', [undefined])).toMatchObject({
      stat1Value: 'Not yet',
      stat2Value: 'Not yet',
      weekNote: 'Goal 15,000',
    })
  })
})
