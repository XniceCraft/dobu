export type DayMark = 'default' | 'success' | 'warning' | 'danger'

export interface CalendarDay {
  label: string
  date: Date
  dateKey: string
}

const ID_DAY_LABELS = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

export function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function getCurrentWeekDays(): CalendarDay[] {
  const today = new Date()
  const jsDay = today.getDay()
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const monIdx = (date.getDay() + 6) % 7

    return {
      label: ID_DAY_LABELS[monIdx],
      date,
      dateKey: toDateKey(date),
    }
  })
}
