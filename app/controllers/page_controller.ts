import Character from '#models/character'
import CharacterTransformer from '#transformers/character_transformer'
import Drink from '#models/drink'
import DrinkLog from '#models/drink_log'
import DrinkTransformer from '#transformers/drink_transformer'
import { DateTime } from 'luxon'
import { getWeekDrinkLogs } from '#helpers/drink'

import type { HttpContext } from '@adonisjs/core/http'

export default class PageController {
  async home({ auth, inertia }: HttpContext) {
    const data = await this.getData(auth.use('web').user!.id)

    return inertia.render('home', data)
  }

  async device({ auth, inertia }: HttpContext) {
    const data = await this.getData(auth.use('web').user!.id)

    return inertia.render('device/index', data)
  }

  async dress({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    const characters = await Character.query().orderBy('createdAt', 'desc')

    const calendar = await getWeekDrinkLogs(user.id)

    return inertia.render('dress', {
      characters: CharacterTransformer.transform(characters),
      calendar,
    })
  }

  private async getData(userId: number) {
    const drink = await Drink.firstOrCreate(
      {
        userId,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: 0,
      }
    )

    // Drink id assigned to today drink data
    const todayDrink = await DrinkLog.query()
      .where('drink_id', drink.id)
      .count('* as total')
      .first()

    const calendar = await getWeekDrinkLogs(userId)

    return {
      drink: DrinkTransformer.transform(drink),
      streak: Number(todayDrink?.$extras.total),
      calendar,
    }
  }
}
