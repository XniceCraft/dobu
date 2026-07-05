import { BaseTransformer } from '@adonisjs/core/transformers'

import type UserDrink from '#models/user_drink'

export default class UserDrinkTransformer extends BaseTransformer<UserDrink> {
  toObject() {
    return this.pick(this.resource, ['id', 'targetMl', 'intervalMinutes', 'streak', 'streakStart'])
  }

  toRanked() {
    return this.pick(this.resource, ['targetMl'])
  }
}
