// How the year grid, month calendar and week chart show each day (from the
// prototype's yearCells, monthCells and weekCols)
import { SLEEP_GOAL, STEP_GOAL } from '@/constants/goals'
import { TRACKERS } from '@/constants/trackers'
import { isLogged } from './checkin'
import { dateKeyOf, daysInMonth, weekdayIndex } from './date'
import { formatHours, formatKilo } from './format'
import type { DateKey, Entry, TrackerId } from '@/types/entry'

export interface DayCell {
  date: DateKey
  state: 'logged' | 'empty' | 'future'
  isToday: boolean
  color: string | undefined // the level's fill, when logged
  ink: string | undefined // text colour on that fill
  label: string // spoken: "1 October: 7.5 hours, felt rested"
}

// One day of one tracker. `name` writes the date the way the view does
// ("1 October" in the year grid, "Thursday 1 October" in the month and week).
export function dayCell(
  tracker: TrackerId,
  date: DateKey,
  entry: Entry | undefined,
  todayKey: DateKey,
  name: (date: DateKey) => string,
): DayCell {
  const def = TRACKERS[tracker]
  const isFuture = date > todayKey
  const logged = !isFuture && !!entry && isLogged(tracker, entry)
  const level = logged ? def.level(entry) : 0

  return {
    date,
    state: logged ? 'logged' : isFuture ? 'future' : 'empty',
    isToday: date === todayKey,
    color: logged ? def.colors[level - 1] : undefined,
    ink: logged ? def.ink[level - 1] : undefined,
    label: `${name(date)}: ${logged ? def.say(entry) : isFuture ? 'still to come' : 'nothing logged'}`,
  }
}

// The year grid, row by row: day 1 of every month, then day 2, … to day 31.
// Dates a month doesn't have (31 February) are null and left blank.
export const yearRows = (year: number): (DateKey | null)[] =>
  Array.from({ length: 31 * 12 }, (_, index) => {
    const day = Math.floor(index / 12) + 1
    const month = (index % 12) + 1
    return day <= daysInMonth(year, month) ? dateKeyOf(year, month, day) : null
  })

// One month in Monday-first weeks, blanks (null) before the 1st and after the last day
export function monthGrid(year: number, month: number): (DateKey | null)[] {
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) =>
    dateKeyOf(year, month, i + 1),
  )
  const lead = weekdayIndex(dateKeyOf(year, month, 1))
  const cells: (DateKey | null)[] = [...Array<null>(lead).fill(null), ...days]
  while (cells.length % 7) cells.push(null)
  return cells
}

// The week chart, in px from the bottom of its 196px-high area: day letters
// take the bottom 32px, bars grow up to 132px, level dots sit in the 114px band above
export const CHART = { height: 196, base: 32, barMax: 132, dotTop: 44, dotBand: 114, dot: 32 }

export interface WeekColumn {
  value: string // over the bar ("7.5", "6.8k"); empty for dots and empty days
  bottom: number
  height: number
  valueBottom: number
}

// Sleep and steps are bars measured against a scale; mood, anxiety and crying are
// dots placed by level. The steps scale stretches to the week's longest walk.
export function weekScale(tracker: TrackerId, entries: (Entry | undefined)[]): number {
  if (tracker === 'sleep') return Math.max(10, SLEEP_GOAL + 2)
  const steps = entries.filter((entry) => isLogged('steps', entry)).map((entry) => entry!.steps!)
  return Math.max(STEP_GOAL * 1.5, ...steps)
}

export const isBarTracker = (tracker: TrackerId): boolean =>
  tracker === 'sleep' || tracker === 'steps'

// Height of a level's dot above the letters: level 1 lowest
export const dotBottom = (tracker: TrackerId, level: number): number =>
  CHART.dotTop + Math.round((level - 1) * (CHART.dotBand / (TRACKERS[tracker].colors.length - 1)))

export function weekColumn(
  tracker: TrackerId,
  entry: Entry | undefined,
  scale: number,
): WeekColumn {
  if (!entry || !isLogged(tracker, entry)) {
    return { value: '', bottom: CHART.base, height: 8, valueBottom: 0 }
  }

  if (isBarTracker(tracker)) {
    const value = tracker === 'sleep' ? entry.hours! : entry.steps!
    const height = Math.max(12, Math.round(Math.min(value / scale, 1) * CHART.barMax))
    return {
      value: tracker === 'sleep' ? formatHours(value) : formatKilo(value),
      bottom: CHART.base,
      height,
      valueBottom: CHART.base + height + 4,
    }
  }

  return {
    value: '',
    bottom: dotBottom(tracker, TRACKERS[tracker].level(entry)),
    height: CHART.dot,
    valueBottom: 0,
  }
}

// Where the dashed goal line sits for the bar trackers
export const goalBottom = (tracker: TrackerId, scale: number): number =>
  CHART.base + Math.round(((tracker === 'sleep' ? SLEEP_GOAL : STEP_GOAL) / scale) * CHART.barMax)
