// The three ways to look at a tracker: Calendar (the year), Month and Week
export type RangeView = 'year' | 'month' | 'week'

// What the two cards under the month and week views say, and the note over the week chart
export interface TrackerSummary {
  value: string // headline, e.g. "7.2 h" (Home cards)
  stat1: string
  stat1Value: string
  stat2: string
  stat2Value: string
  weekNote: string // "Goal 8 h", "Higher is brighter"
}
