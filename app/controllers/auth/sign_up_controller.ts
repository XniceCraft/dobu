import User from '#models/user'
import { signupValidator } from '#validators/user'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { calculateMilliliterTarget } from '#helpers/drink'

import type { HttpContext } from '@adonisjs/core/http'

export default class SignUpController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response }: HttpContext) {
    const { avatar, ...data } = await request.validateUsing(signupValidator)
    const attachment = await attachmentManager.createFromFile(avatar)

    const milliliterTarget = calculateMilliliterTarget({
      birthdate: data.birthdate,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      workType: data.workType,
      climate: data.climate,
    })

    await User.create({
      ...data,
      avatar: attachment,
      milliliterTarget,
    })

    response.redirect().toRoute('auth.login')
  }
}
