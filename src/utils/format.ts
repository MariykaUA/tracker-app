// Numbers written the way the prototype writes them

// 7.5 → "7.5", 8 → "8"
export const formatHours = (hours: number): string =>
  hours % 1 ? hours.toFixed(1) : String(hours)

// 6400 → "6,400"
export const formatNumber = (value: number): string =>
  Math.round(value).toLocaleString('en-US')
