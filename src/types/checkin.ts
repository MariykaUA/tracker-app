import type { Anxiety, Crying, Mood, Rested } from './entry'

// What the check-in form holds while it's open. Steps is the text in its field
// ('' until something is typed); the choices are null until one is picked.
export interface CheckinDraft {
  hours: number
  rested: Rested
  steps: string
  mood: Mood | null
  anx: Anxiety | null
  cry: Crying | null
  imp: string
}
