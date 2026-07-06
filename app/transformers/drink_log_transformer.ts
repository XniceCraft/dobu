import { BaseTransformer } from '@adonisjs/core/transformers'

import type DrinkLog from '#models/drink_log'

export default class DrinkLogTransformer extends BaseTransformer<DrinkLog> {
  toObject() {
    return this.pick(this.resource, ['id', 'amountMl', 'createdAt'])
  }
}
