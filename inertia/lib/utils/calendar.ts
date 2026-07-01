export type DayMark = 'default' | 'success' | 'warning' | 'danger'

export interface CalendarDay {
  label: string
  date: Date
  dateKey: string
}

const ID_DAY_LABELS = ['S', 'S', 'R', 'K', 'J', 'S', 'M']
const TIME_ZONE = 'Asia/Jakarta'

function getZonedParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)

  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value

  return { year: +map.year, month: +map.month, day: +map.day }
}

export function toDateKey(d: Date): string {
  const { year, month, day } = getZonedParts(d)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getCurrentWeekDays(): CalendarDay[] {
  const { year, month, day } = getZonedParts(new Date())

  // Anchor "today" as a UTC-midnight Date representing the Jakarta calendar date.
  // From here we only do calendar-date arithmetic, never rely on local runtime tz.
  const todayAnchor = new Date(Date.UTC(year, month - 1, day))

  const jsDay = todayAnchor.getUTCDay()
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay

  const monday = new Date(todayAnchor)
  monday.setUTCDate(todayAnchor.getUTCDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setUTCDate(monday.getUTCDate() + i)

    return {
      label: ID_DAY_LABELS[i],
      date,
      dateKey: date.toISOString().slice(0, 10), // safe: date is UTC-midnight anchor
    }
  })
}
