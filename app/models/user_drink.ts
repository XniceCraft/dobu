import User from '#models/user'
import { UserDrinkSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserDrink extends UserDrinkSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
