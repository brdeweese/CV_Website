const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Converts a role's start/end into decimal years for plotting.
 *
 * Months are optional. Without them a role is assumed to run for whole calendar
 * years, so `end: 2023` means "through the end of 2023" and plots to 2024.0.
 * With `endMonth: 1` it plots to 2025.083, the end of that January — which is
 * what stops a role that finished in January from being drawn across the whole
 * year and overlapping whatever came next.
 */
export function periodPoints(item, nowYear) {
  const start = item.start + (item.startMonth ? (item.startMonth - 1) / 12 : 0)
  const end = item.end === null ? nowYear : item.end + (item.endMonth ? item.endMonth / 12 : 1)
  return { start, end }
}

/** Human-readable range. `long` spells the month out for the prose list. */
export function formatPeriod(item, long = false) {
  const months = long ? MONTHS_LONG : MONTHS_SHORT
  const fmt = (year, month) => (month ? `${months[month - 1]} ${year}` : `${year}`)

  const start = fmt(item.start, item.startMonth)
  if (item.end === null) return `${start} — Present`

  const end = fmt(item.end, item.endMonth)
  return start === end ? start : `${start} — ${end}`
}
