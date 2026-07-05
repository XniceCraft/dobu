import { BaseTransformer } from '@adonisjs/core/transformers'
import CharacterTransformer from '#transformers/character_transformer'

import type User from '#models/user'

export default class UserTransformer extends BaseTransformer<User> {
  async toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'email', 'milliliterTarget', 'familyId']),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
    }
  }

  async detailed() {
    return {
      ...this.pick(this.resource, [
        'id',
        'birthdate',
        'name',
        'email',
        'gender',
        'weight',
        'height',
        'workType',
        'dayStart',
        'dayEnd',
        'climate',
        'milliliterTarget',
        'intervalMinutes',
      ]),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
    }
  }

  async toRanked() {
    const milliliter =
      this.resource?.drink?.milliliter || Number(this.resource.$extras?.total_milliliter ?? 0)

    return {
      ...this.pick(this.resource, ['id', 'name', 'milliliterTarget']),
      avatar: this.resource.avatar ? await this.resource.avatar.getUrl('thumbnail') : null,
      character: this.resource.character
        ? CharacterTransformer.transform(this.resource.character)
        : null,
      milliliter,
    }
  }
}
