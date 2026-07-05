import User from '#models/user'
import { UserProfileSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserProfile extends UserProfileSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare gender: 'male' | 'female'

  @column()
  declare workType: 'indoor' | 'semi-outdoor' | 'outdoor'

  @column()
  declare climate: 'cold' | 'temperate' | 'hot' | 'tropical'
}
