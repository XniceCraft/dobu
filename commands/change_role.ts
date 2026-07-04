import User from '#models/user'
import { BaseCommand } from '@adonisjs/core/ace'

import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ChangeRole extends BaseCommand {
  static commandName = 'change:role'
  static description = 'Change an user role'

  static options: CommandOptions = {
    /**
     * Start the app to access models and services
     */
    startApp: true,
  }

  async run() {
    const email = await this.prompt.ask('Enter email', {
      validate: (value) => (value.includes('@') ? true : 'Email is invalid'),
    })

    const user = await User.findBy('email', email)
    if (!user) {
      this.logger.info('User not found')
      return
    }

    const newRole = await this.prompt.choice('Select role', ['admin', 'user'])

    user.role = newRole
    await user.save()

    this.logger.info(`Role changed for ${email} to ${newRole}`)
  }
}
