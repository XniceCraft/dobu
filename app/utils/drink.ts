import Drink from '#models/drink'
import { DateTime } from 'luxon'

export async function getWeekDrinkLogs(userId: number): Promise<Record<string, boolean>> {
  const today = DateTime.now()
  const monday = today.startOf('week')
  const sunday = monday.plus({ days: 6 }).endOf('day')

  const rows = await Drink.query()
    .where('userId', userId)
    .whereBetween('drinkDate', [monday.toISODate(), sunday.toISODate()])
    .select('drinkDate')

  const loggedDates = new Set(rows.map((r) => r.drinkDate.toISODate()))

  return Object.fromEntries(
    Array.from({ length: 7 }, (_, i) => {
      const dateKey = monday.plus({ days: i }).toISODate()!
      return [dateKey, loggedDates.has(dateKey)]
    })
  )
}
