import { BaseTransformer } from '@adonisjs/core/transformers'

import type User from '#models/user'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'avatar', 'name', 'email', 'milliliterTarget'])
  }

  detailed() {
    return this.pick(this.resource, [
      'id',
      'birthdate',
      'avatar',
      'name',
      'email',
      'weight',
      'workType',
      'dayStart',
      'dayEnd',
      'milliliterTarget',
    ])
  }
}
