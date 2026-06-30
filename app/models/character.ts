import { CharacterSchema } from '#database/schema'
import { attachment } from '@jrmc/adonis-attachment'

import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class Character extends CharacterSchema {
  @attachment({ folder: 'uploads/characters', variants: ['thumbnail', 'small', 'medium'] })
  declare image: Attachment
}
