import Drink from '#models/drink'
import DrinkTransformer from '#transformers/drink_transformer'
import { DateTime } from 'luxon'
import { DrinkService } from '#services/drink_service'

import type User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PageController {
  async home({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    const data = await this.getData(user)

    return inertia.render('home', {
      ...data,
      targetPerInterval: DrinkService.calculateTargetPerInterval(user),
    })
  }

  private async getData(user: User) {
    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        totalMl: 0,
      }
    )

    const calendar = await DrinkService.getWeekDrinkLogs(user)
    const streak = await DrinkService.getOrUpdateStreak(user)

    return {
      drink: DrinkTransformer.transform(drink),
      streak,
      calendar,
    }
  }
}
