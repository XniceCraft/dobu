import { DrinkService } from '#services/drink_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class BottlesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    await user.loadOnce('drinkPreference')

    const drink = await DrinkService.getTodayDrink(user.id)
    const calendar = await DrinkService.getCalendar(user)
    const streak = await DrinkService.getOrUpdateStreak(user)
    const deltaMl = await DrinkService.getBottleDelta(user)

    return inertia.render('device/index', {
      targetMl: user.drinkPreference.targetMl,
      todayDrinkMl: drink.totalMl,
      intervalMinutes: user.drinkPreference.intervalMinutes,
      targetPerInterval: user.drinkPreference.targetPerInterval,
      drinkCount: user.drinkPreference.drinkCount,
      deltaMl,
      calendar,
      streak,
    })
  }

  async disconnect({ auth, response }: HttpContext) {
    const user = auth.use('web').user!

    await DrinkService.recordDisconnect(user)

    return response.redirect().back()
  }
}
