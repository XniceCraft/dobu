import { DateTime } from 'luxon'
import { queryStatsValidator } from '#validators/stats'
import { DrinkService } from '#services/drink_service'
import { StatsService } from '#services/stats_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class StatsController {
  async index({ auth, inertia, params }: HttpContext) {
    const [error, result] = await queryStatsValidator.tryValidate(params)
    const user = auth.use('web').user!
    const today = DateTime.now()

    const month = error || !result?.month ? today.month : result.month
    const groupBy = error || !result?.groupBy ? 'month' : result.groupBy

    const stats = await StatsService.getStats(user.id, month, groupBy)
    const calendar = await DrinkService.getCalendar(user)

    return inertia.render('stats/index', {
      ...stats,
      calendar,
    })
  }
}
