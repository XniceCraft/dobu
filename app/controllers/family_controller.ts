import Family from '#models/family'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { DateTime } from 'luxon'
import { getWeekDrinkLogs } from '#helpers/drink'
import { uuidv7 } from '#helpers/uuidv7'

import type { HttpContext } from '@adonisjs/core/http'

export default class FamiliyController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    let daily: User[] = []
    let weekly: User[] = []

    if (user.familyId) {
      daily = await User.query()
        .where('familyId', user.familyId)
        .preload('drink', (query) => {
          query.select('milliliter')
        })
        .preload('character')

      weekly = await User.query()
        .where('familyId', user.familyId)
        .withAggregate('drinks', (query) => {
          query
            .sum('milliliter')
            .as('total_milliliter')
            .whereBetween('drink_date', [
              DateTime.now().startOf('week').toSQLDate(),
              DateTime.now().endOf('week').toSQLDate(),
            ])
        })
        .preload('character')

      daily.sort((a, b) => {
        const aMl = a.drink?.milliliter ?? 0
        const bMl = b.drink?.milliliter ?? 0

        return bMl - aMl
      })

      weekly.sort((a, b) => {
        const aMl = Number(a.$extras?.total_milliliter ?? 0)
        const bMl = Number(b.$extras?.total_milliliter ?? 0)

        return bMl - aMl
      })
    }
    const calendar = await getWeekDrinkLogs(user.id)

    return inertia.render('family/index', {
      drink: user.familyId
        ? {
            daily: UserTransformer.transform(daily).useVariant('toRanked') ?? [],
            weekly: UserTransformer.transform(weekly).useVariant('toRanked') ?? [],
          }
        : null,
      calendar,
    })
  }

  async store({ auth, response }: HttpContext) {
    const user = auth.use('web').user!

    if (user.familyId) {
      return response.forbidden()
    }

    const family = await Family.create({ ownerId: user.id, slug: uuidv7() })
    await user.merge({ familyId: family.id }).save()

    return response.redirect().toRoute('family.index')
  }

  async invite({ auth, response, inertia }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('family')

    if (user.family.id !== user.family.ownerId) {
      return response.forbidden()
    }

    const calendar = await getWeekDrinkLogs(user.id)

    return inertia.render('family/invite', { calendar, slug: user.family.slug })
  }

  async join({ auth, params, response }: HttpContext) {
    const family = await Family.findByOrFail('slug', params.slug)

    const user = auth.use('web').user!
    if (user.familyId) {
      return response.forbidden()
    }

    await user.merge({ familyId: family.id }).save()

    return response.redirect().toRoute('family.index')
  }

  async leave({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('family')

    if (!user.familyId) {
      return response.forbidden()
    }

    if (user.family.ownerId !== user.id) {
      await user.merge({ familyId: null }).save()
      return response.redirect().back()
    }

    const members = await User.query().where('familyId', user.familyId).count('* as total')
    await user.merge({ familyId: null }).save()

    if (Number(members[0].$extras.total) <= 1) {
      await user.family.delete()
      return response.redirect().back()
    }

    const firstMember = await User.query().where('familyId', user.familyId).first()
    await user.family.merge({ ownerId: firstMember!.id }).save()

    return response.redirect().back()
  }
}
