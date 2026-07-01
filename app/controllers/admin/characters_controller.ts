import Character from '#models/character'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { upsertCharacterValidator } from '#validators/character'
import CharacterTransformer from '#transformers/character_transformer'

import type { HttpContext } from '@adonisjs/core/http'

export default class CharactersController {
  async index({ inertia }: HttpContext) {
    const characters = await Character.query().orderBy('createdAt', 'desc')

    return inertia.render('admin/characters/index', {
      characters: CharacterTransformer.transform(characters),
    })
  }

  async store({ request, response }: HttpContext) {
    const { name, image } = await request.validateUsing(upsertCharacterValidator)
    const attachment = await attachmentManager.createFromFile(image)

    await Character.create({
      name,
      image: attachment,
    })

    return response.redirect().back()
  }
}
