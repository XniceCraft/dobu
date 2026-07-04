import Drink from '#models/drink'
import DrinkLog from '#models/drink_log'
import { DateTime } from 'luxon'
import { getWeekDrinkLogs } from '#helpers/drink'
import { insertDrinkValidator } from '#validators/drink'

import type { HttpContext } from '@adonisjs/core/http'

export default class DrinksController {
  async create({ inertia, auth }: HttpContext) {
    const calendar = await getWeekDrinkLogs(auth.use('web').user!.id)

    return inertia.render('drink', { calendar })
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
        milliliter: 0,
      }
    )
    const oldMilliliter = drink.milliliter
    drink.milliliter += amount
    await drink.save()

    const newMilliliter = drink.milliliter
    const targetMetBefore = oldMilliliter >= user.milliliterTarget
    const targetMetToday = newMilliliter >= user.milliliterTarget

    if (targetMetToday && !targetMetBefore) {
      if (user.streak > 0 && user.streakStart) {
        const lastCompletedDate = user.streakStart.plus({ days: user.streak - 1 })
        const yesterday = DateTime.now().minus({ days: 1 }).startOf('day')
        const lastCompletedStart = lastCompletedDate.startOf('day')
        const diffDays = yesterday.diff(lastCompletedStart, 'days').days

        if (diffDays === 0) {
          user.streak += 1
        } else {
          user.streak = 1
          user.streakStart = DateTime.now()
        }
      } else {
        user.streak = 1
        user.streakStart = DateTime.now()
      }
      await user.save()
    }

    await DrinkLog.create({
      drinkId: drink.id,
      amountMl: amount,
    })

    return response.redirect().back()
  }
}
