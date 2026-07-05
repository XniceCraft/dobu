import Family from '#models/family'
import User from '#models/user'
import { uuidv7 } from '#helpers/uuidv7'
import { DateTime } from 'luxon'

export class FamilyService {
  static async getRankedFamilyMembers(familyId: number): Promise<{
    daily: User[]
    weekly: User[]
  }> {
    const daily = await User.query()
      .where('familyId', familyId)
      .preload('drink', (query) => {
        query.select('total_ml')
      })
      .preload('character')
      .preload('drinkPreference')

    const weekly = await User.query()
      .where('familyId', familyId)
      .withAggregate('drinks', (query) => {
        query
          .sum('total_ml')
          .as('weekly_ml')
          .whereBetween('drink_date', [
            DateTime.now().startOf('week').toSQLDate(),
            DateTime.now().endOf('week').toSQLDate(),
          ])
      })
      .preload('character')
      .preload('drinkPreference')

    daily.sort((a, b) => {
      const aMl = a.drink?.totalMl ?? 0
      const bMl = b.drink?.totalMl ?? 0
      return bMl - aMl
    })

    weekly.sort((a, b) => {
      const aMl = Number(a.$extras?.weekly_ml ?? 0)
      const bMl = Number(b.$extras?.weekly_ml ?? 0)
      return bMl - aMl
    })

    return { daily, weekly }
  }

  static async createFamily(user: User): Promise<Family> {
    const family = await Family.create({ ownerId: user.id, slug: uuidv7() })
    await user.merge({ familyId: family.id }).save()
    return family
  }

  static async joinFamily(user: User, slug: string): Promise<void> {
    const family = await Family.findByOrFail('slug', slug)
    await user.merge({ familyId: family.id }).save()
  }

  static async leaveFamily(user: User): Promise<void> {
    await user.load('family')

    if (user.family.ownerId !== user.id) {
      await user.merge({ familyId: null }).save()
      return
    }

    // Owner leaving: check member count, transfer ownership or delete family
    const members = await User.query().where('familyId', user.familyId!).count('* as total')
    await user.merge({ familyId: null }).save()

    if (Number(members[0].$extras.total) <= 1) {
      await user.family.delete()
      return
    }

    const firstMember = await User.query().where('familyId', user.family.id).first()
    await user.family.merge({ ownerId: firstMember!.id }).save()
  }
}
