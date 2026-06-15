import { BaseTransformer } from '@adonisjs/core/transformers'

import type Character from '#models/character'

export default class CharacterTransformer extends BaseTransformer<Character> {
  toObject() {
    return this.pick(this.resource, ['id', 'image'])
  }
}
