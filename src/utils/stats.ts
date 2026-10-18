// Summaries calculated from entries, never stored (from the prototype's summary())
import { TRACKERS } from '@/constants/trackers'
import { isLogged } from './checkin'
import { formatNumber } from './format'
import type { Entry, TrackerId } from '@/types/entry'

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length

// The headline for a span of days, e.g. a week on Home: "7.2 h", "8,767",
// "Great", "1 day". Days without a value for the tracker are left out.
export function summaryValue(tracker: TrackerId, entries: (Entry | undefined)[]): string {
  const days = entries.filter((entry): entry is Entry => isLogged(tracker, entry))
  if (!days.length) return 'Not yet'

  const def = TRACKERS[tracker]

  if (tracker === 'sleep') return `${average(days.map((day) => day.hours ?? 0)).toFixed(1)} h`
  if (tracker === 'steps') return formatNumber(average(days.map((day) => day.steps ?? 0)))
  if (tracker === 'crying') {
    const tears = days.filter((day) => day.cry !== 'none').length
    if (tears === 0) return 'No tears'
    return tears === 1 ? '1 day' : `${tears} days`
  }

  // Mood and anxiety: the word for the average level
  const level = Math.round(average(days.map(def.level)))
  return def.labels[level - 1] ?? ''
}
