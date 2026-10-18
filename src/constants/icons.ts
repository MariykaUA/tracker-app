// Tracker icons from design/prototype/assets, used on Home and the tracker pages
import anxietyIcon from '@/assets/icons/icon-anxiety.png'
import cryingIcon from '@/assets/icons/icon-crying.png'
import moodIcon from '@/assets/icons/icon-mood.png'
import sleepIcon from '@/assets/icons/icon-sleep.png'
import stepsIcon from '@/assets/icons/icon-steps.png'
import type { TrackerId } from '@/types/entry'

export const TRACKER_ICONS: Record<TrackerId, string> = {
  sleep: sleepIcon,
  steps: stepsIcon,
  mood: moodIcon,
  anxiety: anxietyIcon,
  crying: cryingIcon,
}
