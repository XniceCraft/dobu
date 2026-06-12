import { DrinkSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import DrinkLog from '#models/drink_log'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Drink extends DrinkSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => DrinkLog)
  declare drinkLogs: HasMany<typeof DrinkLog>
}
