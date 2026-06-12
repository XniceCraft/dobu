import { DrinkLogSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Drink from '#models/drink'
import User from '#models/user'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DrinkLog extends DrinkLogSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Drink)
  declare drink: BelongsTo<typeof Drink>
}
