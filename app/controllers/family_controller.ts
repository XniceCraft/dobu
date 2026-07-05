import UserTransformer from '#transformers/user_transformer'
import { DrinkService } from '#services/drink_service'
import { FamilyService } from '#services/family_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class FamilyController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    const calendar = await DrinkService.getWeekDrinkLogs(user)

    if (!user.familyId) {
      return inertia.render('family/index', { drink: null, calendar })
    }

    const { daily, weekly } = await FamilyService.getRankedFamilyMembers(user.familyId)

    return inertia.render('family/index', {
      drink: {
        daily: UserTransformer.transform(daily).useVariant('toRanked') ?? [],
        weekly: UserTransformer.transform(weekly).useVariant('toRanked') ?? [],
      },
      calendar,
    })
  }

  async store({ auth, response }: HttpContext) {
    const user = auth.use('web').user!

    if (user.familyId) {
      return response.forbidden()
    }

    await FamilyService.createFamily(user)

    return response.redirect().toRoute('family.index')
  }

  async invite({ auth, response, inertia }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('family')

    if (user.family.id !== user.family.ownerId) {
      return response.forbidden()
    }

    const calendar = await DrinkService.getWeekDrinkLogs(user)

    return inertia.render('family/invite', { calendar, slug: user.family.slug })
  }

  async join({ auth, params, response }: HttpContext) {
    const user = auth.use('web').user!

    if (user.familyId) {
      return response.forbidden()
    }

    await FamilyService.joinFamily(user, params.slug)

    return response.redirect().toRoute('family.index')
  }

  async leave({ auth, response }: HttpContext) {
    const user = auth.use('web').user!

    if (!user.familyId) {
      return response.forbidden()
    }

    await FamilyService.leaveFamily(user)

    return response.redirect().back()
  }
}
