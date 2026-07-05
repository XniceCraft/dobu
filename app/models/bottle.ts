import User from '#models/user'
import { BottleSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Bottle extends BottleSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
