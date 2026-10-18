import type { DateKey } from '@/types/entry'

// The device's time zone, e.g. "Europe/Zurich"
export const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

// A moment in time as "2026-10-17" in the given time zone.
// Don't use toISOString(): it's UTC and shifts the day after midnight in Zürich.
export const toDateKey = (date: Date, timeZone: string = TIME_ZONE): DateKey =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

export const yearOf = (dateKey: DateKey): number => Number(dateKey.slice(0, 4))
export const monthOf = (dateKey: DateKey): number => Number(dateKey.slice(5, 7))
export const dayOf = (dateKey: DateKey): number => Number(dateKey.slice(8, 10))

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate()

// Calendar dates are counted in UTC, so daylight-saving changes never skip or repeat a day
export const dateKeyOf = (year: number, month: number, day: number): DateKey =>
  toDateKey(new Date(Date.UTC(year, month - 1, day)), 'UTC')

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// 10 → "October"
export const monthName = (month: number): string => MONTHS[month - 1] ?? ''

// "2026-10-08" → 3: days since Monday, for laying out Monday-first weeks
export const weekdayIndex = (dateKey: DateKey): number =>
  (new Date(Date.UTC(yearOf(dateKey), monthOf(dateKey) - 1, dayOf(dateKey))).getUTCDay() + 6) % 7

// "2026-10-08" → "8 October", the year grid's day labels
export const shortDate = (dateKey: DateKey): string =>
  `${dayOf(dateKey)} ${monthName(monthOf(dateKey))}`

// First and last day → "5 to 11 October", or "28 September to 4 October" across months
export const dateRange = (first: DateKey, last: DateKey): string =>
  monthOf(first) === monthOf(last)
    ? `${dayOf(first)} to ${shortDate(last)}`
    : `${shortDate(first)} to ${shortDate(last)}`

// "2026-10-08" → "Thursday 8 October", as the prototype writes dates
export const longDate = (dateKey: DateKey): string => {
  const year = yearOf(dateKey)
  const month = monthOf(dateKey)
  const day = dayOf(dateKey)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()

  return `${WEEKDAYS[weekday]} ${day} ${monthName(month)}`
}

// "2026-10-08" → the seven date keys of its week, Monday first
export const weekOf = (dateKey: DateKey): DateKey[] => {
  const year = yearOf(dateKey)
  const month = monthOf(dateKey)
  const day = dayOf(dateKey)
  const sinceMonday = weekdayIndex(dateKey)

  return Array.from({ length: 7 }, (_, i) => dateKeyOf(year, month, day - sinceMonday + i))
}
