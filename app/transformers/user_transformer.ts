import { BaseTransformer } from '@adonisjs/core/transformers'
import CharacterTransformer from '#transformers/character_transformer'
import UserProfileTransformer from '#transformers/user_profile_transformer'
import UserDrinkTransformer from '#transformers/user_drink_transformer'

import type User from '#models/user'

export default class UserTransformer extends BaseTransformer<User> {
  async toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'email']),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
    }
  }

  async detailed() {
    return {
      ...this.toObject(),
      profile: UserProfileTransformer.transform(this.resource.profile),
      drinkPreference: UserDrinkTransformer.transform(this.resource.drinkPreference),
    }
  }

  async toRanked() {
    const totalMl = this.resource?.drink?.totalMl || Number(this.resource.$extras?.weekly_ml ?? 0)

    return {
      ...this.toObject(),
      character: this.resource.character
        ? CharacterTransformer.transform(this.resource.character)
        : null,
      drinkPreference: UserDrinkTransformer.transform(this.resource.drinkPreference).useVariant(
        'toRanked'
      ),
      totalMl,
    }
  }
}
