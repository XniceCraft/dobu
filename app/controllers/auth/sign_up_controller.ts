import User from '#models/user'
import { signupValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

function calculateWaterIntake(weight: number, workType: User['workType']): number {
  const BASE_ML_PER_KG = 33

  const multiplier: Record<User['workType'], number> = {
    'indoor': 1.0,
    'semi-outdoor': 1.2,
    'outdoor': 1.5,
  }

  return Math.round(weight * BASE_ML_PER_KG * multiplier[workType])
}
export default class SignUpController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    await User.create({
      ...payload,
      milliliterTarget: calculateWaterIntake(payload.weight, payload.workType),
    })

    response.redirect().toRoute('auth.login')
  }
}
