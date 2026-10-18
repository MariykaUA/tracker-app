import type { Timestamp } from 'firebase/firestore'

export type DateKey = string // "YYYY-MM-DD"

export type Rested = 1 | 2 | 3 | 4 | 5 // Drained → Fully rested
export type Mood = 'bad' | 'low' | 'okay' | 'good' | 'great'
export type Anxiety = 'calm' | 'mild' | 'high'
export type Crying = 'none' | 'some' | 'lots'
export type TrackerId = 'sleep' | 'steps' | 'mood' | 'anxiety' | 'crying'

// What the check-in collects; every field is optional because any step can be skipped
export interface DayValues {
  hours: number
  rested: Rested
  steps: number
  mood: Mood
  note: string
  anx: Anxiety
  cry: Crying
  imp: string
}

export interface Entry extends Partial<DayValues> {
  date: DateKey
  year: number
  month: number
  updatedAt?: Timestamp
}

export type EntriesByDate = Record<DateKey, Entry>
