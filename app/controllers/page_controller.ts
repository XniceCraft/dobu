import Drink from '#models/drink'
import DrinkTransformer from '#transformers/drink_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class PageController {
  async home({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: 0,
      }
    )

    return inertia.render('home', {
      drink: DrinkTransformer.transform(drink),
    })
  }

  async device({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: 0,
      }
    )

    return inertia.render('device', {
      drink: DrinkTransformer.transform(drink),
    })
  }
}
