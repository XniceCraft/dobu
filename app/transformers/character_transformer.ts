import { BaseTransformer } from '@adonisjs/core/transformers'

import type Character from '#models/character'

export default class CharacterTransformer extends BaseTransformer<Character> {
  async toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name']),
      image: await this.resource.image.getUrl(),
    }
  }
}
