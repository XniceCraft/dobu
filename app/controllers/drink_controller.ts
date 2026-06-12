import Drink from '#models/drink'
import DrinkLog from '#models/drink_log'
import { DateTime } from 'luxon'
import { insertDrinkValidator } from '#validators/drink'

import type { HttpContext } from '@adonisjs/core/http'

export default class DrinksController {
  async create({ inertia }: HttpContext) {
    return inertia.render('drink', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const { amount } = await request.validateUsing(insertDrinkValidator)
    const user = auth.use('web').user!

    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: amount,
      }
    )
    drink.milliliter += amount
    await drink.save()

    await DrinkLog.create({
      drinkId: drink.id,
      amountMl: amount,
    })

    return response.redirect().back()
  }
}
