import { BaseTransformer } from '@adonisjs/core/transformers'

import type User from '#models/user'

export default class UserTransformer extends BaseTransformer<User> {
  async toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'email', 'milliliterTarget']),
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
        'weight',
        'workType',
        'dayStart',
        'dayEnd',
        'milliliterTarget',
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
      milliliter,
    }
  }
}
