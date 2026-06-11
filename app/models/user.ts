import hash from '@adonisjs/core/services/hash'
import { attachment } from '@jrmc/adonis-attachment'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { UserSchema } from '#database/schema'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import { column } from '@adonisjs/lucid/orm'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @attachment({ folder: 'uploads/avatars' })
  declare avatar: Attachment

  @column()
  declare workType: 'indoor' | 'semi-outdoor' | 'outdoor'

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
