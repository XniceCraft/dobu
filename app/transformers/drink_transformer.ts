import { BaseTransformer } from '@adonisjs/core/transformers'
import type Drink from '#models/drink'

export default class DrinkTransformer extends BaseTransformer<Drink> {
  toObject() {
    return this.pick(this.resource, ['id', 'totalMl'])
  }
}
