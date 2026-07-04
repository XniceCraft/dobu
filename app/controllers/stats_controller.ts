import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { queryStatsValidator } from '#validators/stat'
import Drink from '#models/drink'
import DrinkTransformer from '#transformers/drink_transformer'

import type { HttpContext } from '@adonisjs/core/http'

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

export default class StatsController {
  async index({ auth, inertia, params }: HttpContext) {
    const [error, result] = await queryStatsValidator.tryValidate(params)
    const user = auth.use('web').user!
    const today = DateTime.now()

    const yearStart = today.startOf('year').toISODate()!
    const yearEnd = today.endOf('year').toISODate()!

    const month = error || !result?.month ? today.month : result.month
    const groupBy = error || !result?.groupBy ? 'month' : result.groupBy

    const perMonthData = await Drink.query()
      .where('userId', user.id)
      .whereBetween('drinkDate', [
        today.startOf('month').toISODate(),
        today.endOf('month').toISODate(),
      ])

    const perYearData = await Drink.query()
      .where('userId', user.id)
      .whereBetween('drinkDate', [
        today.startOf('year').toISODate(),
        today.endOf('year').toISODate(),
      ])

    const monthStart = today.set({ month }).startOf('month')
    const monthEnd = today.set({ month }).endOf('month')

    const monthRows = await Drink.query()
      .where('userId', user.id)
      .whereBetween('drinkDate', [monthStart.toISODate()!, monthEnd.toISODate()!])
      .select('drinkDate', 'milliliter')

    const totals = new Map<WeekdayName, number>()
    for (const row of monthRows) {
      const name = WEEKDAY_NAMES[row.drinkDate.weekday - 1]
      totals.set(name, (totals.get(name) ?? 0) + row.milliliter)
    }

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
      .sum('milliliter as total_ml')
      .where('user_id', user.id)
      .whereBetween('drink_date', [yearStart, yearEnd])
      .groupByRaw("DATE_FORMAT(drink_date, '%Y-%m')")) as Array<{ month: string; total_ml: number }>

    for (const row of rawMonthlyData) {
      monthSkeleton.set(row.month, Number(row.total_ml))
    }

    const monthlyChartData = Array.from(monthSkeleton, ([key, total_ml]) => ({
      month: key,
      total_ml,
    }))

    return inertia.render('stats/index', {
      month,
      groupBy,
      perMonthData: DrinkTransformer.transform(perMonthData),
      perYearData: DrinkTransformer.transform(perYearData),
      weeklyChartData,
      monthlyChartData,
    })
  }
}
