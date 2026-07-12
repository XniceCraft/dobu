import Character from '#models/character'
import CharacterTransformer from '#transformers/character_transformer'
import { DrinkService } from '#services/drink_service'
import { updateUserCharacterValidator } from '#validators/character'

import type { HttpContext } from '@adonisjs/core/http'

export default class CharactersController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!
    const characters = await Character.query().orderBy('createdAt', 'desc')
    const userCharacter = auth.use('web').user!.characterId

    const calendar = await DrinkService.getWeekDrinkLogs(user)

    return inertia.render('dress/index', {
      characters: CharacterTransformer.transform(characters),
      calendar,
      userCharacter,
    })
  }

  async update({ auth, request, response }: HttpContext) {
    const { characterId } = await request.validateUsing(updateUserCharacterValidator)
    const user = auth.use('web').user!

    await user.merge({ characterId }).save()

    return response.redirect().back()
  }
}
