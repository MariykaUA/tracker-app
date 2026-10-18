// The five trackers, copied from the prototype's TR and FG tables in
// design/prototype/Main.dc.html (rule 5). Entries only store raw values;
// everything a screen shows about them (levels, colours, words) comes from here.
import { STEP_GOAL } from './goals'
import { formatHours, formatNumber } from '@/utils/format'
import type { ChoiceOption } from '@/types/choice'
import type { Anxiety, Crying, Entry, Mood, TrackerId } from '@/types/entry'

export interface TrackerDef {
  name: string
  step: number // index of its question in the check-in
  disc: string // backing behind the mascot on its check-in question
  tint: string
  colors: readonly string[] // fill for level 1 → n
  ink: readonly string[] // text colour that stays readable on each level's fill
  labels: readonly string[] // word for each level
  legend: readonly number[] // levels in legend order
  hint: string
  weekTitle: string
  cheer: string
  isLogged: (entry: Entry) => boolean
  level: (entry: Entry) => number // 1-based; only call when isLogged
  say: (entry: Entry) => string // the value in words, for labels and chips
}

export const TRACKER_ORDER: readonly TrackerId[] = ['sleep', 'steps', 'mood', 'anxiety', 'crying']

// For values from outside the code, like the :id in /tracker/:id
export const isTrackerId = (value: unknown): value is TrackerId =>
  TRACKER_ORDER.includes(value as TrackerId)

export const RESTED_LABELS = ['Drained', 'Tired', 'Okay', 'Rested', 'Fully rested'] as const
export const MOOD_LABELS = ['Very Bad', 'Not Good', 'Okay', 'Good', 'Great'] as const
export const ANXIETY_LABELS = ['Calm', 'Mild', 'High'] as const
export const CRYING_LABELS = ['No tears', 'A few tears', 'A good cry'] as const

export const MOOD_LEVEL: Record<Mood, number> = { bad: 1, low: 2, okay: 3, good: 4, great: 5 }
export const ANXIETY_LEVEL: Record<Anxiety, number> = { calm: 1, mild: 2, high: 3 }
export const CRYING_LEVEL: Record<Crying, number> = { none: 1, some: 2, lots: 3 }

const restedLevel = (entry: Entry): number => Math.max(1, Math.min(5, entry.rested ?? 3))

const stepsLevel = (entry: Entry): number => {
  const share = (entry.steps ?? 0) / STEP_GOAL
  return share >= 1 ? 5 : share >= 0.8 ? 4 : share >= 0.6 ? 3 : share >= 0.4 ? 2 : 1
}

export const TRACKERS: Record<TrackerId, TrackerDef> = {
  sleep: {
    name: 'Sleep',
    step: 0,
    disc: '#1f2833',
    tint: '#45a29e',
    colors: ['#0b0c10', '#1f2833', '#c5c6c7', '#45a29e', '#66fcf1'],
    ink: ['#ffffff', '#ffffff', '#3f2d5c', '#2b1d42', '#3f2d5c'],
    labels: RESTED_LABELS,
    legend: [5, 4, 3, 2, 1],
    hint: 'Colour shows how rested you felt: cyan and teal for rested, navy and black for tired.',
    weekTitle: 'Hours slept',
    cheer: 'Rest is part of the work.',
    isLogged: (entry) => entry.hours != null,
    level: restedLevel,
    say: (entry) =>
      `${formatHours(entry.hours ?? 0)} hours, felt ${RESTED_LABELS[restedLevel(entry) - 1]!.toLowerCase()}`,
  },
  steps: {
    name: 'Steps',
    step: 1,
    disc: '#fdeaf2',
    tint: '#f7c7db',
    colors: ['#d7c0d0', '#f7c7db', '#f79ad3', '#c86fc9', '#8e518d'],
    ink: ['#3f2d5c', '#3f2d5c', '#3f2d5c', '#2b1d42', '#ffffff'],
    labels: ['Rest day', 'Light', 'Steady', 'Almost there', 'Goal met'],
    legend: [5, 4, 3, 2, 1],
    hint: 'Deeper colour means closer to your goal.',
    weekTitle: 'Steps walked',
    cheer: 'Every step counts.',
    isLogged: (entry) => entry.steps != null,
    level: stepsLevel,
    say: (entry) => `${formatNumber(entry.steps ?? 0)} steps`,
  },
  mood: {
    name: 'Mood',
    step: 2,
    disc: '#ffe787',
    tint: '#ffe787',
    colors: ['#231c07', '#8b2635', '#7c9082', '#ffe787', '#2cf6b3'],
    ink: ['#ffffff', '#ffffff', '#231c07', '#3f2d5c', '#3f2d5c'],
    labels: MOOD_LABELS,
    legend: [5, 4, 3, 2, 1],
    hint: 'One colour for each mood.',
    weekTitle: 'How the week felt',
    cheer: 'Every kind of day belongs here.',
    isLogged: (entry) => entry.mood != null,
    level: (entry) => MOOD_LEVEL[entry.mood!],
    say: (entry) => MOOD_LABELS[MOOD_LEVEL[entry.mood!] - 1]!,
  },
  anxiety: {
    name: 'Anxiety',
    step: 3,
    disc: '#d6ffec',
    tint: '#a5ffd6',
    colors: ['#a5ffd6', '#ffa69e', '#ff686b'],
    ink: ['#3f2d5c', '#3f2d5c', '#2b1d42'],
    labels: ANXIETY_LABELS,
    legend: [1, 2, 3],
    hint: 'Mint is a calm day, red is a high-anxiety day.',
    weekTitle: 'Anxiety this week',
    cheer: 'Noticing it is already something.',
    isLogged: (entry) => entry.anx != null,
    level: (entry) => ANXIETY_LEVEL[entry.anx!],
    say: (entry) => ANXIETY_LABELS[ANXIETY_LEVEL[entry.anx!] - 1]!,
  },
  crying: {
    name: 'Crying',
    step: 4,
    disc: '#e1e5f2',
    tint: '#bfdbf7',
    colors: ['#bfdbf7', '#1f7a8c', '#022b3a'],
    ink: ['#3f2d5c', '#ffffff', '#ffffff'],
    labels: CRYING_LABELS,
    legend: [1, 2, 3],
    hint: 'Darker means more tears.',
    weekTitle: 'Tears this week',
    cheer: 'Tears are allowed here.',
    isLogged: (entry) => entry.cry != null,
    level: (entry) => CRYING_LEVEL[entry.cry!],
    say: (entry) => CRYING_LABELS[CRYING_LEVEL[entry.cry!] - 1]!,
  },
}

// The sixth check-in question ("What made today count?") has no colour scale,
// only its own disc behind the mascot
export const ONE_THING_DISC = '#ece2f2'

// A check-in tile takes its level's fill and text colour; the edge is the tile's own
const choice = <T extends string>(
  tracker: TrackerId,
  value: T,
  level: number,
  edge: string,
): ChoiceOption<T> => ({
  value,
  label: TRACKERS[tracker].labels[level - 1]!,
  color: TRACKERS[tracker].colors[level - 1]!,
  ink: TRACKERS[tracker].ink[level - 1]!,
  edge,
})

// In the order the check-in shows them
export const MOOD_CHOICES: readonly ChoiceOption<Mood>[] = [
  choice('mood', 'great', 5, '#23c58f'),
  choice('mood', 'good', 4, '#ccb96c'),
  choice('mood', 'okay', 3, '#637368'),
  choice('mood', 'low', 2, '#6f1e2a'),
  choice('mood', 'bad', 1, '#0d0a02'),
]

export const ANXIETY_CHOICES: readonly ChoiceOption<Anxiety>[] = [
  choice('anxiety', 'calm', 1, '#87d1af'),
  choice('anxiety', 'mild', 2, '#d18882'),
  choice('anxiety', 'high', 3, '#d15558'),
]

export const CRYING_CHOICES: readonly ChoiceOption<Crying>[] = [
  choice('crying', 'none', 1, '#9dbfe0'),
  choice('crying', 'some', 2, '#155b69'),
  choice('crying', 'lots', 3, '#00141c'),
]
