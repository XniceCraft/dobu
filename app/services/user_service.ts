import User from '#models/user'
import { DrinkService } from '#services/drink_service'
import { attachmentManager } from '@jrmc/adonis-attachment'

import type { Infer } from '@vinejs/vine/types'
import type { signupValidator } from '#validators/user'
import type UserProfile from '#models/user_profile'

const INTERVAL_MINUTES_BY_WORK_TYPE: Record<UserProfile['workType'], number> = {
  'indoor': 60,
  'semi-outdoor': 45,
  'outdoor': 30,
}

export class UserService {
  static async createUser(payload: Infer<typeof signupValidator>): Promise<User> {
    const attachment = await attachmentManager.createFromFile(payload.avatar)

    const targetMl = DrinkService.calculateMilliliterTarget({
      birthdate: payload.birthdate,
      weight: payload.weight,
      height: payload.height,
      gender: payload.gender,
      workType: payload.workType,
      climate: payload.climate,
    })

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

    await user.related('drinkPreference').create({
      targetMl,
      intervalMinutes: INTERVAL_MINUTES_BY_WORK_TYPE[payload.workType],
      streak: 0,
    })

    return user
  }
}
