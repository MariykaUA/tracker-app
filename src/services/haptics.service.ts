// The prototype's buzz(): a little vibration on phones that support it (Android
// browsers). Elsewhere, iPhones included, it quietly does nothing, so nothing
// may ever depend on it.

export const TAP = 8 // ms: picking, stepping, moving between days or months
export const SUCCESS = [18, 60, 28] // buzz, pause, buzz: a day saved or the check-in done

export function buzz(pattern: number | number[]): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    // No haptics here
  }
}
