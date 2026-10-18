// Current time from the server, via the HTTP Date header of our own site.
// Same-origin request, so no CORS issues and no third-party time API.
export async function getServerNow(): Promise<Date> {
  try {
    const res = await fetch(window.location.origin, {
      method: 'HEAD',
      cache: 'no-store',
      // The app waits for this on start, so a bad connection mustn't hold it up
      signal: AbortSignal.timeout(3000),
    })
    const header = res.headers.get('date')
    if (header) return new Date(header)
  } catch {
    // Offline or too slow: fall back to the device clock below
  }
  return new Date()
}
