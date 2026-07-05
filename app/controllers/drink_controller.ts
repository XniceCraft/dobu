import { DrinkService } from '#services/drink_service'
import { insertDrinkValidator } from '#validators/drink'

import type { HttpContext } from '@adonisjs/core/http'

export default class DrinksController {
  async create({ inertia, auth }: HttpContext) {
    const calendar = await DrinkService.getWeekDrinkLogs(auth.use('web').user!.id)

    return inertia.render('drink', { calendar })
  }

  async store({ request, response, auth }: HttpContext) {
    const { amount } = await request.validateUsing(insertDrinkValidator)
    const user = auth.use('web').user!

    await DrinkService.logDrink(user, amount)

    return response.redirect().back()
  }

  async disconnect({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    await DrinkService.recordDisconnect(user)
    return response.ok({ success: true })
  }

  async sync({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    const delta = await DrinkService.getSyncDelta(user)
    return response.ok({ delta })
  }
}

