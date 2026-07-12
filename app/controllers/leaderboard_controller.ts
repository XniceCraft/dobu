import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class LeaderboardController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!

    let members = []
    if (user.familyId) {
      members = await User.query().where('family_id', user.familyId).preload('drinkPreference')
    } else {
      await user.load('drinkPreference')
      members.push(user)
    }

    return inertia.render('leaderboard/index', {
      members: UserTransformer.transform(members).useVariant('toWithDrinkPreference'),
    })
  }
}
