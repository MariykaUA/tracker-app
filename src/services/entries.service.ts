import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { yearOf, monthOf } from '@/utils/date'
import type { DateKey, DayValues, Entry, EntriesByDate } from '@/types/entry'

// users/{uid}: the list of years that have data
interface UserDoc {
  years?: number[]
}

const userRef = (uid: string) => doc(db, 'users', uid)
const entriesRef = (uid: string) => collection(db, 'users', uid, 'entries')

// Save or update one day. merge: true keeps other trackers intact.
// One batch, so the day and its year are queued together when offline;
// two awaited writes would hold back the second until the first reached the server.
export async function saveDay(
  uid: string,
  dateKey: DateKey,
  data: Partial<DayValues>,
): Promise<void> {
  const year = yearOf(dateKey)
  const batch = writeBatch(db)

  batch.set(
    doc(entriesRef(uid), dateKey),
    { ...data, date: dateKey, year, month: monthOf(dateKey), updatedAt: serverTimestamp() },
    { merge: true },
  )
  // Registers the year once; arrayUnion ignores duplicates
  batch.set(userRef(uid), { years: arrayUnion(year) }, { merge: true })

  await batch.commit()
}

// All entries of one year, keyed by date: { "2026-10-17": {...}, ... }
export async function loadYear(uid: string, year: number): Promise<EntriesByDate> {
  const q = query(
    entriesRef(uid),
    where('date', '>=', `${year}-01-01`),
    where('date', '<=', `${year}-12-31`),
    orderBy('date'),
  )
  const snap = await getDocs(q)
  return Object.fromEntries(snap.docs.map((d) => [d.id, d.data() as Entry]))
}

// Years that have data, e.g. [2026, 2027]
export async function loadYears(uid: string): Promise<number[]> {
  const snap = await getDoc(userRef(uid))
  const years = (snap.data() as UserDoc | undefined)?.years ?? []
  return years.sort((a, b) => a - b)
}
