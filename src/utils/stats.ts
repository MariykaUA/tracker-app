// Summaries calculated from entries, never stored (from the prototype's summary())
import { SLEEP_GOAL, STEP_GOAL } from '@/constants/goals'
import { TRACKERS } from '@/constants/trackers'
import { isLogged } from './checkin'
import { formatHours, formatNumber } from './format'
import type { TrackerSummary } from '@/types/calendar'
import type { Entry, TrackerId } from '@/types/entry'

const NOT_YET = 'Not yet'

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length

const countOf = (count: number, total: number): string => `${count} of ${total}`

// A span of days (a week, the days of a month so far) summed up for one tracker.
// Days without a value for the tracker are left out; a span with none says "Not yet".
export function summarize(tracker: TrackerId, entries: (Entry | undefined)[]): TrackerSummary {
  const def = TRACKERS[tracker]
  const days = entries.filter((entry): entry is Entry => isLogged(tracker, entry))
  const none = !days.length
  // The word for the average level ("Rested", "Good", "Mild")
  const typical = none ? NOT_YET : (def.labels[Math.round(average(days.map(def.level))) - 1] ?? '')

  if (tracker === 'sleep') {
    const hours = none ? NOT_YET : `${average(days.map((day) => day.hours ?? 0)).toFixed(1)} h`
    return {
      value: hours,
      stat1: 'Average slept',
      stat1Value: hours,
      stat2: 'Felt on average',
      stat2Value: typical,
      weekNote: `Goal ${formatHours(SLEEP_GOAL)} h`,
    }
  }

  if (tracker === 'steps') {
    const steps = none ? NOT_YET : formatNumber(average(days.map((day) => day.steps ?? 0)))
    const goalDays = days.filter((day) => (day.steps ?? 0) >= STEP_GOAL).length
    return {
      value: steps,
      stat1: 'Daily average',
      stat1Value: steps,
      stat2: 'Goal days',
      stat2Value: none ? NOT_YET : countOf(goalDays, days.length),
      weekNote: `Goal ${formatNumber(STEP_GOAL)}`,
    }
  }

  if (tracker === 'mood') {
    // Notes count on every day of the span, with or without a mood
    const notes = entries.filter((entry) => entry?.note).length
    return {
      value: typical,
      stat1: 'Typical mood',
      stat1Value: typical,
      stat2: 'Notes written',
      stat2Value: none ? NOT_YET : String(notes),
      weekNote: 'Higher is brighter',
    }
  }

  if (tracker === 'anxiety') {
    const calm = days.filter((day) => day.anx === 'calm').length
    return {
      value: typical,
      stat1: 'Typical day',
      stat1Value: typical,
      stat2: 'Calm days',
      stat2Value: none ? NOT_YET : countOf(calm, days.length),
      weekNote: 'Higher is heavier',
    }
  }

  const tears = days.filter((day) => day.cry !== 'none').length
  const tearsValue = tears === 0 ? 'No tears' : tears === 1 ? '1 day' : `${tears} days`
  return {
    value: none ? NOT_YET : tearsValue,
    stat1: 'Days with tears',
    stat1Value: none ? NOT_YET : countOf(tears, days.length),
    stat2: 'Typical day',
    stat2Value: typical,
    weekNote: 'Higher is more',
  }
}

// The headline alone, e.g. a week on Home: "7.2 h", "8,767", "Great", "1 day"
export const summaryValue = (tracker: TrackerId, entries: (Entry | undefined)[]): string =>
  summarize(tracker, entries).value
