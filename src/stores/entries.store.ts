import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loadYear, loadYears, saveDay } from '@/services/entries.service'
import { getServerNow } from '@/services/time.service'
import { monthOf, toDateKey, weekOf, yearOf } from '@/utils/date'
import { useAuthStore } from './auth.store'
import type { DateKey, DayValues, EntriesByDate, Entry, WeekDay } from '@/types/entry'

export const useEntriesStore = defineStore('entries', () => {
  const auth = useAuthStore()

  const todayKey = ref<DateKey>('') // set by refreshToday() before the app mounts
  const selectedYear = ref(0)
  const years = ref<number[]>([])
  const entriesByYear = ref<Record<number, EntriesByDate>>({}) // cache, so switching back doesn't refetch
  const isLoading = ref(false)

  const todayYear = computed(() => yearOf(todayKey.value))
  const entries = computed<EntriesByDate>(() => entriesByYear.value[selectedYear.value] ?? {})
  const todayEntry = computed<Entry | undefined>(
    () => entriesByYear.value[todayYear.value]?.[todayKey.value],
  )
  // Monday to Sunday of this week; around New Year the days come from two years
  const weekEntries = computed<WeekDay[]>(() =>
    weekOf(todayKey.value).map((date) => ({
      date,
      entry: entriesByYear.value[yearOf(date)]?.[date],
    })),
  )

  function requireUid(): string {
    if (!auth.uid) throw new Error('Not signed in yet')
    return auth.uid
  }

  // Called on start and whenever the app comes back to the foreground, so an app
  // left open overnight moves to the new day (and on 1 January, the new year)
  async function refreshToday(): Promise<void> {
    const key = toDateKey(await getServerNow())
    const followsToday = selectedYear.value === todayYear.value

    todayKey.value = key
    if (followsToday) selectedYear.value = yearOf(key)
  }

  async function fetchYears(): Promise<void> {
    const loaded = await loadYears(requireUid())
    // The current year is always selectable, even before its first entry
    years.value = loaded.includes(todayYear.value)
      ? loaded
      : [...loaded, todayYear.value].sort((a, b) => a - b)
  }

  async function fetchYear(year: number): Promise<void> {
    if (entriesByYear.value[year]) return

    isLoading.value = true
    try {
      entriesByYear.value[year] = await loadYear(requireUid(), year)
    } finally {
      isLoading.value = false
    }
  }

  // The year(s) this week falls in, for the Home cards and Week view
  async function fetchWeek(): Promise<void> {
    const weekYears = new Set(weekOf(todayKey.value).map(yearOf))
    await Promise.all([...weekYears].map(fetchYear))
  }

  async function setYear(year: number): Promise<void> {
    selectedYear.value = year
    await fetchYear(year)
  }

  // Updates the cache first so the UI changes instantly, then saves. The save
  // resolves once the server has it; offline it stays pending until the
  // connection is back, so the UI shouldn't wait on it to move on.
  async function save(dateKey: DateKey, data: Partial<DayValues>): Promise<void> {
    const uid = requireUid()
    const year = yearOf(dateKey)
    const yearEntries = (entriesByYear.value[year] ??= {})
    const previous = yearEntries[dateKey]

    yearEntries[dateKey] = { ...previous, ...data, date: dateKey, year, month: monthOf(dateKey) }
    if (!years.value.includes(year)) years.value = [...years.value, year].sort((a, b) => a - b)

    try {
      await saveDay(uid, dateKey, data)
    } catch (error) {
      if (previous) yearEntries[dateKey] = previous
      else delete yearEntries[dateKey]
      throw error
    }
  }

  return {
    todayKey,
    selectedYear,
    years,
    entriesByYear,
    isLoading,
    entries,
    todayEntry,
    weekEntries,
    refreshToday,
    fetchYears,
    fetchYear,
    fetchWeek,
    setYear,
    save,
  }
})
