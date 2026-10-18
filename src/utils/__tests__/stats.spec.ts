import { describe, expect, it } from 'vitest'
import { summaryValue } from '../stats'
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
