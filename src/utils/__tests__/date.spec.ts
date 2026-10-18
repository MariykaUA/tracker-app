import { describe, expect, it } from 'vitest'
import { dayOf, daysInMonth, monthOf, toDateKey, weekOf, yearOf } from '../date'

describe('toDateKey', () => {
  it('formats a moment as YYYY-MM-DD', () => {
    expect(toDateKey(new Date('2026-10-17T12:00:00Z'), 'Europe/Zurich')).toBe('2026-10-17')
  })

  it('uses the given time zone, not UTC', () => {
    // 00:30 on 18 October in Zürich is still 17 October in UTC
    const justAfterMidnight = new Date('2026-10-17T22:30:00Z')
    expect(toDateKey(justAfterMidnight, 'Europe/Zurich')).toBe('2026-10-18')
    expect(toDateKey(justAfterMidnight, 'UTC')).toBe('2026-10-17')
  })

  it('switches to the new year at local midnight', () => {
    expect(toDateKey(new Date('2026-12-31T23:30:00Z'), 'Europe/Zurich')).toBe('2027-01-01')
  })
})

describe('yearOf, monthOf, dayOf', () => {
  it('read the parts of a date key', () => {
    expect(yearOf('2026-10-08')).toBe(2026)
    expect(monthOf('2026-10-08')).toBe(10)
    expect(dayOf('2026-10-08')).toBe(8)
  })
})

describe('daysInMonth', () => {
  it('knows month lengths', () => {
    expect(daysInMonth(2026, 10)).toBe(31)
    expect(daysInMonth(2026, 11)).toBe(30)
  })

  it('handles leap years', () => {
    expect(daysInMonth(2026, 2)).toBe(28)
    expect(daysInMonth(2028, 2)).toBe(29)
  })
})

describe('weekOf', () => {
  it('returns Monday to Sunday around a date', () => {
    // The prototype's week: Monday 5 to Sunday 11 October 2026
    expect(weekOf('2026-10-08')).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ])
  })

  it('starts on the same day when given a Monday or a Sunday', () => {
    expect(weekOf('2026-10-05')[0]).toBe('2026-10-05')
    expect(weekOf('2026-10-11')[0]).toBe('2026-10-05')
  })

  it('crosses month and year boundaries', () => {
    expect(weekOf('2027-01-01')).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])
  })

  it('is not shifted by a daylight-saving change', () => {
    // Clocks go back in Zürich on Sunday 25 October 2026
    expect(weekOf('2026-10-25')).toEqual([
      '2026-10-19',
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
    ])
  })
})
