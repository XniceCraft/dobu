import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting', {
      role: user.role,
    })
  }
}
