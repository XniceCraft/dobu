import vine from '@vinejs/vine'
import { imageField } from '#validators/image'

export const createCharacterValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  image: imageField(),
})

export const updateCharacterValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  image: imageField().optional(),
})

export const updateUserCharacterValidator = vine.create({
  characterId: vine.number().exists({ table: 'characters', column: 'id' }),
})
