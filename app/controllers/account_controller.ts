import UserTransformer from '#transformers/user_transformer'
import { updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { attachmentManager } from '@jrmc/adonis-attachment'

export default class AccountController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/account', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async showBirthdate({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/birthdate', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async showWeight({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/weight', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async showDays({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/days', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async showWorkType({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('setting/work-type', {
      user: UserTransformer.transform(user).useVariant('detailed'),
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    const { avatar, ...data } = await request.validateUsing(updateUserValidator)

    if (avatar) {
      await user.avatar?.remove()
      user.avatar = await attachmentManager.createFromFile(avatar)
    }

    await user.merge(data).save()

    return response.redirect().back()
  }
}
