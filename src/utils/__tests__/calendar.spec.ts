import { describe, expect, it } from 'vitest'
import {
  dayCell,
  dotBottom,
  goalBottom,
  monthGrid,
  weekColumn,
  weekScale,
  yearRows,
} from '../calendar'
import { longDate, shortDate } from '../date'
import type { Entry } from '@/types/entry'

const TODAY = '2026-10-08'

const day = (date: string, values: Partial<Entry>): Entry => ({
  date,
  year: 2026,
  month: 10,
  ...values,
})

describe('dayCell', () => {
  it('fills a logged day with its level and says its value', () => {
    const cell = dayCell('sleep', '2026-10-01', day('2026-10-01', { hours: 7.5, rested: 4 }), TODAY, shortDate)
    expect(cell).toMatchObject({
      state: 'logged',
      color: '#45a29e',
      ink: '#2b1d42',
      label: '1 October: 7.5 hours, felt rested',
    })
  })

  it('names an empty past day and a day still to come', () => {
    expect(dayCell('mood', '2026-10-04', undefined, TODAY, longDate)).toMatchObject({
      state: 'empty',
      label: 'Sunday 4 October: nothing logged, tap to add',
    })
    expect(dayCell('mood', '2026-10-09', undefined, TODAY, longDate)).toMatchObject({
      state: 'future',
      label: 'Friday 9 October: still to come',
    })
  })

  it('treats a day logged for another tracker as empty', () => {
    const cell = dayCell('mood', '2026-10-06', day('2026-10-06', { hours: 6.5 }), TODAY, shortDate)
    expect(cell.state).toBe('empty')
  })

  it('marks today', () => {
    expect(dayCell('steps', TODAY, undefined, TODAY, shortDate).isToday).toBe(true)
  })
})

describe('yearRows', () => {
  it('goes row by row, a day of every month per row', () => {
    const rows = yearRows(2026)
    expect(rows).toHaveLength(372)
    expect(rows.slice(0, 2)).toEqual(['2026-01-01', '2026-02-01'])
    expect(rows[12]).toBe('2026-01-02')
  })

  it('leaves dates a month does not have blank', () => {
    const rows = yearRows(2026)
    expect(rows[28 * 12 + 1]).toBeNull() // 29 February 2026
    expect(yearRows(2028)[28 * 12 + 1]).toBe('2028-02-29')
  })
})

describe('monthGrid', () => {
  it('starts on Monday, with blanks before the 1st', () => {
    // 1 October 2026 is a Thursday
    const cells = monthGrid(2026, 10)
    expect(cells.slice(0, 4)).toEqual([null, null, null, '2026-10-01'])
    expect(cells.length % 7).toBe(0)
    expect(cells.filter(Boolean)).toHaveLength(31)
  })
})

describe('weekColumn', () => {
  it('draws sleep as a bar against a 10-hour scale', () => {
    const scale = weekScale('sleep', [])
    expect(weekColumn('sleep', day(TODAY, { hours: 7.5, rested: 4 }), scale)).toEqual({
      value: '7.5',
      bottom: 32,
      height: 99,
      valueBottom: 135,
    })
  })

  it('stretches the steps scale to the longest walk', () => {
    expect(weekScale('steps', [day(TODAY, { steps: 6800 })])).toBe(22500)
    expect(weekScale('steps', [day(TODAY, { steps: 30000 })])).toBe(30000)
  })

  it('places mood, anxiety and crying as dots by level', () => {
    expect(weekColumn('mood', day(TODAY, { mood: 'bad' }), 0).bottom).toBe(44)
    expect(weekColumn('mood', day(TODAY, { mood: 'great' }), 0).bottom).toBe(158)
    expect(dotBottom('anxiety', 2)).toBe(101)
  })

  it('shows an empty day as a short outline', () => {
    expect(weekColumn('steps', undefined, 22500)).toMatchObject({ value: '', height: 8 })
  })
})

describe('goalBottom', () => {
  it('puts the sleep goal at 8 of 10 hours', () => {
    expect(goalBottom('sleep', 10)).toBe(138)
  })
})
