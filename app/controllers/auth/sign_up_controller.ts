import { signupValidator } from '#validators/user'
import { UserService } from '#services/user_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class SignUpController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    await UserService.createUser(payload)

    response.redirect().toRoute('auth.login')
  }
}
