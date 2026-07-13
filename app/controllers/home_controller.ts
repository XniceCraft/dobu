import { DrinkService } from '#services/drink_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('drinkPreference')

    const drink = await DrinkService.getTodayDrink(user.id)
    const calendar = await DrinkService.getCalendar(user)
    const streak = await DrinkService.getOrUpdateStreak(user)

    return inertia.render('home', {
      streak,
      calendar,
      targetPerInterval: user.drinkPreference.targetPerInterval,
      targetMl: user.drinkPreference.targetMl,
      todayDrinkMl: drink.totalMl,
      intervalMinutes: user.drinkPreference.intervalMinutes,
    })
  }
}
