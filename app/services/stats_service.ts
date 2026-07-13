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
  groupBy: string
  perMonthData: ReturnType<typeof DrinkTransformer.transform>
  perYearData: ReturnType<typeof DrinkTransformer.transform>
  weeklyChartData: { day: WeekdayName; total_ml: number }[]
  monthlyChartData: { month: string; total_ml: number }[]
}

export class StatsService {
  static async getStats(userId: number, groupBy: string): Promise<StatsData> {
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

    const totals = new Map<WeekdayName, number>()

    const weeklyChartData = WEEKDAY_NAMES.map((day) => ({
      day,
      total_ml: totals.get(day) ?? 0,
    }))

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
      groupBy,
      perMonthData: DrinkTransformer.transform(perMonthData),
      perYearData: DrinkTransformer.transform(perYearData),
      weeklyChartData,
      monthlyChartData,
    }
  }
}
