import User from '#models/user'
import { loginValidator } from '#validators/user'
import { errors as authErrors } from '@adonisjs/auth'

import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password, rememberMe } = await request.validateUsing(loginValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user, rememberMe ?? false)

      response.redirect().toRoute('home')
    } catch (error) {
      if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
        session.flash('inputErrorsBag', {
          email: 'Email atau password salah!',
        })

        return response.redirect().back()
      }

      response.redirect().toRoute('auth.login')
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    response.redirect().toRoute('auth.login')
  }
}
