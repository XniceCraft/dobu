import User from '#models/user'
import { DrinkService } from '#services/drink_service'
import { attachmentManager } from '@jrmc/adonis-attachment'

import type { MultipartFile } from '@adonisjs/core/types/bodyparser'
import type { Infer } from '@vinejs/vine/types'
import type { signupValidator } from '#validators/user'

const INTERVAL_MINUTES_BY_WORK_TYPE: Record<User['workType'], number> = {
  'indoor': 60,
  'semi-outdoor': 45,
  'outdoor': 30,
}

type SignupPayload = Infer<typeof signupValidator>

export class UserService {
  static async createUser(
    data: Omit<SignupPayload, 'avatar'>,
    avatar: MultipartFile
  ): Promise<User> {
    const attachment = await attachmentManager.createFromFile(avatar)

    const milliliterTarget = DrinkService.calculateMilliliterTarget({
      birthdate: data.birthdate,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      workType: data.workType,
      climate: data.climate,
    })

    return User.create({
      ...data,
      avatar: attachment,
      intervalMinutes: INTERVAL_MINUTES_BY_WORK_TYPE[data.workType],
      milliliterTarget,
    })
  }
}
