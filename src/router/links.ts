import type { RouteLocationRaw } from 'vue-router'
import type { DateKey } from '@/types/entry'

// The check-in opened on one question (a tracker page's "Log now")
export const checkinAt = (step: number): RouteLocationRaw => ({
  name: 'checkin',
  query: { step },
})

// The one-day editor: one question for one day, with Save (artboard 16)
export const editDay = (date: DateKey, step: number): RouteLocationRaw => ({
  name: 'checkin',
  query: { date, step },
})
