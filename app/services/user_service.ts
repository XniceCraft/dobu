import User from '#models/user'
import { DrinkService } from '#services/drink_service'
import { attachmentManager } from '@jrmc/adonis-attachment'

import type { Infer } from '@vinejs/vine/types'
import type { signupValidator } from '#validators/user'

export class UserService {
  static async createUser(payload: Infer<typeof signupValidator>): Promise<User> {
    const attachment = await attachmentManager.createFromFile(payload.avatar)

    const user = await User.create({
      avatar: attachment,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: 'user',
    })

    await user.related('profile').create({
      gender: payload.gender,
      weight: payload.weight,
      height: payload.height,
      birthdate: payload.birthdate,
      dayStart: payload.dayStart,
      dayEnd: payload.dayEnd,
      climate: payload.climate,
      workType: payload.workType,
    })

    await DrinkService.generateUserDrink(user, {
      birthdate: payload.birthdate,
      weight: payload.weight,
      height: payload.height,
      gender: payload.gender,
      workType: payload.workType,
      climate: payload.climate,
      dayStart: payload.dayStart,
      dayEnd: payload.dayEnd,
    })

    return user
  }
}
