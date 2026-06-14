import Drink from '#models/drink'
import hash from '@adonisjs/core/services/hash'
import { attachment } from '@jrmc/adonis-attachment'
import { compose } from '@adonisjs/core/helpers'
import { column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { UserSchema } from '#database/schema'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { DateTime } from 'luxon'

import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
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

  @column()
  declare workType: 'indoor' | 'semi-outdoor' | 'outdoor'

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
