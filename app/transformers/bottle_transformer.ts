import { BaseTransformer } from '@adonisjs/core/transformers'

import type Bottle from '#models/bottle'

export default class BottleTransformer extends BaseTransformer<Bottle> {
  toObject() {
    return this.pick(this.resource, ['id', 'remainingPercent', 'volumeMl'])
  }
}
