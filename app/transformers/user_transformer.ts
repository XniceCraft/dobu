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
      ...this.pick(this.resource, ['id', 'name', 'email']),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
      profile: UserProfileTransformer.transform(this.resource.profile),
      drinkPreference: UserDrinkTransformer.transform(this.resource.drinkPreference),
    }
  }

  async toRanked() {
    // const milliliter =
    //   this.resource?.drink?.milliliter || Number(this.resource.$extras?.total_milliliter ?? 0)

    return {
      ...this.pick(this.resource, ['id', 'name']),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
      character: this.resource.character
        ? CharacterTransformer.transform(this.resource.character)
        : null,
      drinkPreference: UserDrinkTransformer.transform(this.resource.drinkPreference).useVariant(
        'toRanked'
      ),
    }
  }
}
