import { updateUserProfileValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async update({ request, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    const data = await request.validateUsing(updateUserProfileValidator)

    await user.profile.merge(data).save()

    return response.redirect().back()
  }
}
