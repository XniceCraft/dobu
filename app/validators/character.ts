import vine from '@vinejs/vine'
import { imageField } from '#validators/image'

export const upsertCharacterValidator = vine.create({
  image: imageField(),
})
