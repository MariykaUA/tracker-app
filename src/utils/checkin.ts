// The check-in's rules, from the prototype's draftFrom, commit, firstGap and nextOff
import { SLEEP_GOAL } from '@/constants/goals'
import { TRACKER_ORDER, TRACKERS } from '@/constants/trackers'
import type { CheckinDraft } from '@/types/checkin'
import type { DayValues, Entry, TrackerId } from '@/types/entry'

// Sleep, steps, mood, anxiety, crying, then the one thing worth celebrating
export const CHECKIN_STEPS = 6
export const LAST_STEP = CHECKIN_STEPS - 1
export const MAX_ONE_THING = 140 // characters

export const isLogged = (tracker: TrackerId, entry: Entry | undefined): boolean =>
  !!entry && TRACKERS[tracker].isLogged(entry)

// All five trackers logged (the one thing is optional)
export const isComplete = (entry: Entry | undefined): boolean =>
  TRACKER_ORDER.every((tracker) => isLogged(tracker, entry))

// The check-in opens on the first tracker not logged yet, or at the start
export const firstGap = (entry: Entry | undefined): number => {
  const index = TRACKER_ORDER.findIndex((tracker) => !isLogged(tracker, entry))
  return index < 0 ? 0 : index
}

// The form starts from what's saved; sleep starts at the goal, rested at "Okay"
export const draftFrom = (entry: Entry | undefined): CheckinDraft => ({
  hours: Math.min(entry?.hours ?? SLEEP_GOAL, 12),
  rested: entry?.rested ?? 3,
  steps: entry?.steps != null ? String(entry.steps) : '',
  mood: entry?.mood ?? null,
  anx: entry?.anx ?? null,
  cry: entry?.cry ?? null,
  imp: entry?.imp ?? '',
})

// Steps need a number, the choices need a pick; sleep and the one thing are always fine
export const canContinue = (step: number, draft: CheckinDraft): boolean => {
  if (step === 1) return draft.steps !== ''
  if (step === 2) return draft.mood !== null
  if (step === 3) return draft.anx !== null
  if (step === 4) return draft.cry !== null
  return true
}

// The values one step saves when moving on, so leaving halfway keeps what was answered
export const stepValues = (step: number, draft: CheckinDraft): Partial<DayValues> => {
  if (step === 0) return { hours: draft.hours, rested: draft.rested }
  if (step === 1) return { steps: Number.parseInt(draft.steps || '0', 10) || 0 }
  if (step === 2) return draft.mood ? { mood: draft.mood } : {}
  if (step === 3) return draft.anx ? { anx: draft.anx } : {}
  if (step === 4) return draft.cry ? { cry: draft.cry } : {}
  return { imp: draft.imp.trim() }
}
