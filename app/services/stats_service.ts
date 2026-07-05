import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Drink from '#models/drink'
import DrinkTransformer from '#transformers/drink_transformer'

const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

type WeekdayName = (typeof WEEKDAY_NAMES)[number]

export interface StatsData {
  month: number
  groupBy: string
  perMonthData: ReturnType<typeof DrinkTransformer.transform>
  perYearData: ReturnType<typeof DrinkTransformer.transform>
  weeklyChartData: { day: WeekdayName; total_ml: number }[]
  monthlyChartData: { month: string; total_ml: number }[]
  calendarData: Record<string, boolean>
}

export class StatsService {
  static async getStats(userId: number, month: number, groupBy: string): Promise<StatsData> {
    const today = DateTime.now()
    const yearStart = today.startOf('year').toISODate()!
    const yearEnd = today.endOf('year').toISODate()!

    const perMonthData = await Drink.query()
      .where('userId', userId)
      .whereBetween('drinkDate', [
        today.startOf('month').toISODate(),
        today.endOf('month').toISODate(),
      ])

    const perYearData = await Drink.query()
      .where('userId', userId)
      .whereBetween('drinkDate', [
        today.startOf('year').toISODate(),
        today.endOf('year').toISODate(),
      ])

    const monthStart = today.set({ month }).startOf('month')
    const monthEnd = today.set({ month }).endOf('month')

    const monthRows = await Drink.query()
      .where('userId', userId)
      .whereBetween('drinkDate', [monthStart.toISODate()!, monthEnd.toISODate()!])
      .select('drinkDate', 'totalMl')

    const totals = new Map<WeekdayName, number>()
    const calendarData: Record<string, boolean> = {}
    for (const row of monthRows) {
      const name = WEEKDAY_NAMES[row.drinkDate.weekday - 1]
      totals.set(name, (totals.get(name) ?? 0) + row.totalMl)
      calendarData[row.drinkDate.toISODate()!] = true
    }

    const weeklyChartData = WEEKDAY_NAMES.map((day) => ({
      day,
      total_ml: totals.get(day) ?? 0,
    }))

    // Monthly chart — aggregate per calendar month for the year
    const monthSkeleton = new Map<string, number>(
      Array.from({ length: 12 }, (_, i) => [today.set({ month: i + 1 }).toFormat('yyyy-MM'), 0])
    )

    const rawMonthlyData = (await db
      .from('drinks')
      .select(db.raw("DATE_FORMAT(drink_date, '%Y-%m') as month"))
      .sum('total_ml as month_ml')
      .where('user_id', userId)
      .whereBetween('drink_date', [yearStart, yearEnd])
      .groupByRaw("DATE_FORMAT(drink_date, '%Y-%m')")) as Array<{ month: string; month_ml: number }>

    for (const row of rawMonthlyData) {
      monthSkeleton.set(row.month, Number(row.month_ml))
    }

    const monthlyChartData = Array.from(monthSkeleton, ([key, total_ml]) => ({
      month: key,
      total_ml,
    }))

    return {
      month,
      groupBy,
      perMonthData: DrinkTransformer.transform(perMonthData),
      perYearData: DrinkTransformer.transform(perYearData),
      weeklyChartData,
      monthlyChartData,
      calendarData,
    }
  }
}
