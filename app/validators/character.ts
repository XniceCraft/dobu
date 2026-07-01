import vine from '@vinejs/vine'
import { imageField } from '#validators/image'

export const upsertCharacterValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  image: imageField(),
})

export const updateUserCharacterValidator = vine.create({
  characterId: vine.number().exists({ table: 'characters', column: 'id' }),
})
