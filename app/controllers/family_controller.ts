import { DateTime } from 'luxon'
import FamilyMember from '#models/family_member'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

import type { HttpContext } from '@adonisjs/core/http'

export default class FamiliyController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    const family = await FamilyMember.findBy('user_id', user.id)
    let members: User[] = []

    if (family) {
      const today = DateTime.now().toSQLDate()

      members = await User.query()
        .whereIn('id', FamilyMember.query().select('user_id').where('family_id', family.familyId))
        .preload('drink', (query) => {
          query.where('drink_date', today)
        })

      members.sort((a, b) => {
        const aMl = a.drink?.milliliter ?? 0
        const bMl = b.drink?.milliliter ?? 0

        return bMl - aMl
      })
    }

    return inertia.render('family', {
      drink: { daily: UserTransformer.transform(members).useVariant('toRanked') ?? [], weekly: [] },
    })
  }
}
