import Character from '#models/character'
import Drink from '#models/drink'
import Family from '#models/family'
import hash from '@adonisjs/core/services/hash'
import { attachment } from '@jrmc/adonis-attachment'
import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { UserSchema } from '#database/schema'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { DateTime } from 'luxon'

import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasOne(() => Character)
  declare character: HasOne<typeof Character>

  // Used to get single data (today)
  @hasOne(() => Drink, {
    onQuery: (query) => {
      query.where('drink_date', DateTime.now().toSQLDate())
    },
  })
  declare drink: HasOne<typeof Drink>

  // Used for aggregating (weekly)
  @hasMany(() => Drink)
  declare drinks: HasMany<typeof Drink>

  @attachment({ folder: 'uploads/avatars' })
  declare avatar: Attachment

  @belongsTo(() => Family)
  declare family: BelongsTo<typeof Family>

  @column()
  declare workType: 'indoor' | 'semi-outdoor' | 'outdoor'

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
