import UserTransformer from '#transformers/user_transformer'
import { updateUserValidator } from '#validators/user'
import { attachmentManager } from '@jrmc/adonis-attachment'

import type { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')
    await user.load('drinkPreference')

    return inertia.render('setting/account', {
      user: UserTransformer.transform(user).useVariant('toDetailed'),
    })
  }

  async showBirthdate({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    return inertia.render('setting/birthdate', {
      user: UserTransformer.transform(user).useVariant('toWithProfile'),
    })
  }

  async showWeight({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    return inertia.render('setting/weight', {
      user: UserTransformer.transform(user).useVariant('toWithProfile'),
    })
  }

  async showHeight({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    return inertia.render('setting/height', {
      user: UserTransformer.transform(user).useVariant('toWithProfile'),
    })
  }

  async showDays({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    return inertia.render('setting/days', {
      user: UserTransformer.transform(user).useVariant('toWithProfile'),
    })
  }

  async showWorkType({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile')

    return inertia.render('setting/work-type', {
      user: UserTransformer.transform(user).useVariant('toWithProfile'),
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    const { avatar, ...data } = await request.validateUsing(updateUserValidator)

    if (avatar) {
      await user.avatar?.remove()
      const attachment = await attachmentManager.createFromFile(avatar)
      attachment.getDisk().delete(attachment.path!)
      user.avatar = attachment
    }

    await user.merge(data).save()

    return response.redirect().back()
  }
}
