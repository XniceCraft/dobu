import CharacterTransformer from '#transformers/character_transformer'
import DrinkLogTransformer from '#transformers/drink_log_transformer'
import { DrinkService } from '#services/drink_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class SharesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('character')
    await user.load('drinkPreference')

    const todayDrink = await DrinkService.getTodayDrink(user.id)
    const todayLogs = await DrinkService.getTodayDrinkLogs(user.id)
    const streak = await DrinkService.getOrUpdateStreak(user)

    return inertia.render('share/index', {
      todayDrinkMl: todayDrink.totalMl,
      todayLogs: DrinkLogTransformer.transform(todayLogs),
      targetMl: user.drinkPreference.targetMl,
      targetPerInterval: user.drinkPreference.targetPerInterval,
      character: CharacterTransformer.transform(user.character),
      streak,
    })
  }
}
