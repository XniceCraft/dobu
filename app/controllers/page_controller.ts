import Drink from '#models/drink'
import DrinkTransformer from '#transformers/drink_transformer'
import { DateTime } from 'luxon'
import { getWeekDrinkLogs, getOrUpdateStreak } from '#helpers/drink'

import type User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PageController {
  async home({ auth, inertia }: HttpContext) {
    const data = await this.getData(auth.use('web').user!)

    return inertia.render('home', data)
  }

  async device({ auth, inertia }: HttpContext) {
    const data = await this.getData(auth.use('web').user!)

    return inertia.render('device/index', data)
  }

  private async getData(user: User) {
    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: 0,
      }
    )

    const calendar = await getWeekDrinkLogs(user.id)
    const streak = await getOrUpdateStreak(user)

    return {
      drink: DrinkTransformer.transform(drink),
      streak,
      calendar,
    }
  }
}
