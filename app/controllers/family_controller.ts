import { DateTime } from 'luxon'
import { getWeekDrinkLogs } from '#utils/drink'
import FamilyMember from '#models/family_member'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

import type { HttpContext } from '@adonisjs/core/http'

export default class FamiliyController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    const family = await FamilyMember.findBy('user_id', user.id)
    let daily: User[] = []
    let weekly: User[] = []

    if (family) {
      daily = await User.query()
        .whereIn('id', FamilyMember.query().select('user_id').where('family_id', family.familyId))
        .preload('drink', (query) => {
          query.select('milliliter')
        })

      weekly = await User.query()
        .whereIn('id', FamilyMember.query().select('user_id').where('family_id', family.familyId))
        .withAggregate('drinks', (query) => {
          query
            .sum('milliliter')
            .as('total_milliliter')
            .whereBetween('drink_date', [
              DateTime.now().startOf('week').toSQLDate(),
              DateTime.now().endOf('week').toSQLDate(),
            ])
        })

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

    return inertia.render('family', {
      drink: {
        daily: UserTransformer.transform(daily).useVariant('toRanked') ?? [],
        weekly: UserTransformer.transform(weekly).useVariant('toRanked') ?? [],
      },
      calendar,
    })
  }

  async store() {}
}
