import { CharacterSchema } from '#database/schema'
import { Attachment, attachment } from '@jrmc/adonis-attachment'

export default class Character extends CharacterSchema {
  @attachment({ folder: 'uploads/characters', variants: ['thumbnail', 'small', 'medium'] })
  declare image: Attachment
}
