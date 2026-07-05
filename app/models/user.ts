import Character from '#models/character'
import Drink from '#models/drink'
import Family from '#models/family'
import UserDrink from '#models/user_drink'
import UserProfile from '#models/user_profile'
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

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, AuthFinder) {
  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => Family)
  declare family: BelongsTo<typeof Family>

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @hasOne(() => UserDrink)
  declare drinkPreference: HasOne<typeof UserDrink>

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

  @attachment({ folder: 'uploads/avatars', variants: ['thumbnail', 'small'] })
  declare avatar: Attachment

  @column()
  declare role: 'user' | 'admin'

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
