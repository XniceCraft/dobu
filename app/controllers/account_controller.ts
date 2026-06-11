import UserTransformer from '#transformers/user_transformer'
import { updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/account', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    const data = await request.validateUsing(updateUserValidator)

    await user.merge(data).save()

    return response.redirect().back()
  }
}
