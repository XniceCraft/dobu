import User from '#models/user'
import { IssueSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Issue extends IssueSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare status: 'open' | 'closed'
}
