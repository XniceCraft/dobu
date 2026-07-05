import Character from '#models/character'
import CharacterTransformer from '#transformers/character_transformer'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { createCharacterValidator, updateCharacterValidator } from '#validators/character'

import type { HttpContext } from '@adonisjs/core/http'

export default class CharactersController {
  async index({ inertia }: HttpContext) {
    const characters = await Character.query().orderBy('createdAt', 'desc')

    return inertia.render('admin/characters/index', {
      characters: CharacterTransformer.transform(characters),
    })
  }

  async store({ request, response }: HttpContext) {
    const { name, image } = await request.validateUsing(createCharacterValidator)
    const attachment = await attachmentManager.createFromFile(image)
    attachment.getDisk().delete(attachment.path!)

    await Character.create({
      name,
      image: attachment,
    })

    return response.redirect().back()
  }

  async update({ request, response, params }: HttpContext) {
    const character = await Character.findOrFail(params.id)
    const { name, image } = await request.validateUsing(updateCharacterValidator)

    character.name = name
    if (image) {
      await character.image?.remove()
      character.image = await attachmentManager.createFromFile(image)
    }

    await character.save()

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const character = await Character.findOrFail(params.id)

    await character.delete()

    return response.redirect().back()
  }
}
