import { computed, ref, watch } from 'vue'
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
  const pending = ref(0) // year loads still running for this account

  // Bumped on every account change: loads started for the previous account
  // finish into nothing, so its entries can't reach the new one's cache
  let generation = 0
  let inflight = new Map<number, Promise<void>>() // one load per year at a time

  // The account's first load needs today's year, which comes from the server
  let markTodaySet = (): void => {}
  const todaySet = new Promise<void>((resolve) => {
    markTodaySet = resolve
  })

  const isLoading = computed(() => pending.value > 0)

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
    markTodaySet()
  }

  async function fetchYears(): Promise<void> {
    const started = generation
    const loaded = await loadYears(requireUid())
    if (started !== generation) return
    // The current year is always selectable, even before its first entry
    years.value = loaded.includes(todayYear.value)
      ? loaded
      : [...loaded, todayYear.value].sort((a, b) => a - b)
  }

  // Skips a cached year; a year already loading shares that load. The uid is
  // read when the load starts, and the result is dropped if the account changed.
  function fetchYear(year: number): Promise<void> {
    if (entriesByYear.value[year]) return Promise.resolve()
    const running = inflight.get(year)
    if (running) return running

    const uid = requireUid()
    const started = generation
    const load = (async () => {
      pending.value++
      try {
        const loaded = await loadYear(uid, year)
        if (started === generation) entriesByYear.value[year] = loaded
      } finally {
        if (started === generation) {
          pending.value--
          inflight.delete(year)
        }
      }
    })()

    inflight.set(year, load)
    return load
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

  // Back to the state of a fresh start: nothing cached, nothing loading
  function reset(): void {
    generation++
    inflight = new Map()
    pending.value = 0
    years.value = []
    entriesByYear.value = {}
    selectedYear.value = todayYear.value
  }

  // What every screen needs first: the years list, the selected year and this week
  async function loadAccount(): Promise<void> {
    const started = generation
    await todaySet
    if (started !== generation) return

    selectedYear.value = todayYear.value
    try {
      await Promise.all([fetchYears(), fetchYear(selectedYear.value), fetchWeek()])
    } catch (error) {
      console.error(error)
    }
  }

  // The one place that follows the account. Signing in, creating an account
  // and signing out all start from an empty cache, then load the new account,
  // so one person's entries are never shown to another. An anonymous session
  // has no entries to show (the router keeps it on the sign-in pages).
  watch(
    () => (auth.isSignedIn ? auth.uid : null),
    (uid) => {
      reset()
      if (uid) void loadAccount()
    },
  )

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
