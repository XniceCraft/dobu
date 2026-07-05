import Drink from '#models/drink'
import DrinkLog from '#models/drink_log'
import User from '#models/user'
import { DateTime } from 'luxon'

const BASE_ML_PER_KG = {
  male: 35,
  female: 31,
} as const

const WORK_TYPE_ADDITION_ML = {
  'indoor': 0,
  'semi-outdoor': 450,
  'outdoor': 900,
} as const

const CLIMATE_ADDITION_ML = {
  cold: -150,
  temperate: 0,
  hot: 500,
  tropical: 800,
} as const

const FOOD_WATER_FRACTION = 0.2

// Mosteller formula: BSA (m²) = √(height_cm × weight_kg / 3600)
// Used to scale insensible losses (respiration, skin diffusion)
// EFSA references surface-area-based loss at ~400 mL/m²/day
const INSENSIBLE_LOSS_ML_PER_M2 = 400

function getAge(birthdate: DateTime): number {
  return Math.floor(DateTime.now().diff(birthdate, 'years').years)
}

function getAgeMultiplier(age: number): number {
  if (age > 55) return 1.15
  if (age < 18) return 1.1
  return 1.0
}

function getBsaInsensibleLoss(heightCm: number, weightKg: number): number {
  const bsa = Math.sqrt((heightCm * weightKg) / 3600)
  return bsa * INSENSIBLE_LOSS_ML_PER_M2
}

function timeToMinutes(time: string): number {
  const [h, m, s] = time.split(':').map(Number)
  return h * 60 + m + s / 60
}

export class DrinkService {
  static async getWeekDrinkLogs(userId: number): Promise<Record<string, boolean>> {
    const user = await User.findOrFail(userId)
    const target = user.milliliterTarget

    const today = DateTime.now()
    const monday = today.startOf('week')

    const rows = await Drink.query()
      .where('userId', userId)
      .whereBetween('drinkDate', [monday.toISODate()!, today.toISODate()!])

    const totalsByDate = new Map<string, number>()
    for (const row of rows) {
      const key = row.drinkDate.toISODate()!
      totalsByDate.set(key, (totalsByDate.get(key) ?? 0) + row.milliliter)
    }

    return Object.fromEntries(
      Array.from({ length: today.diff(monday, 'days').days + 1 }, (_, i) => {
        const dateKey = monday.plus({ days: i }).toISODate()!
        const total = totalsByDate.get(dateKey) ?? 0
        return [dateKey, total >= target]
      })
    )
  }

  static async getOrUpdateStreak(user: User): Promise<number> {
    if (user.streak > 0 && user.streakStart) {
      const lastCompletedDate = user.streakStart.plus({ days: user.streak - 1 })
      const today = DateTime.now().startOf('day')
      const lastCompletedStart = lastCompletedDate.startOf('day')
      const diffDays = today.diff(lastCompletedStart, 'days').days

      if (diffDays > 1) {
        user.streak = 0
        user.streakStart = null
        await user.save()
        return 0
      }
      return user.streak
    }
    return 0
  }

  static calculateMilliliterTarget(params: {
    birthdate: DateTime
    weight: number
    height: number
    gender: 'male' | 'female'
    workType: 'indoor' | 'semi-outdoor' | 'outdoor'
    climate: 'cold' | 'temperate' | 'hot' | 'tropical'
  }): number {
    const age = getAge(params.birthdate)

    const base = params.weight * BASE_ML_PER_KG[params.gender]
    const ageAdjusted = base * getAgeMultiplier(age)

    const insensibleLoss = getBsaInsensibleLoss(params.height, params.weight)

    const activityAddition = WORK_TYPE_ADDITION_ML[params.workType]
    const climateAddition = CLIMATE_ADDITION_ML[params.climate]

    const totalLoss = ageAdjusted + insensibleLoss + activityAddition + climateAddition

    const beverageTarget = totalLoss * (1 - FOOD_WATER_FRACTION)

    return Math.round(beverageTarget)
  }

  static calculateTargetPerInterval(user: User): number {
    const startMinutes = timeToMinutes(user.dayStart)
    const endMinutes = timeToMinutes(user.dayEnd)
    const duration = endMinutes - startMinutes
    const drinkCount = Math.floor(duration / user.intervalMinutes)

    return Math.round(user.milliliterTarget / drinkCount)
  }

  static async logDrink(user: User, amount: number): Promise<Drink> {
    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        milliliter: 0,
      }
    )

    const oldMilliliter = drink.milliliter
    drink.milliliter += amount
    await drink.save()

    const newMilliliter = drink.milliliter
    const targetMetBefore = oldMilliliter >= user.milliliterTarget
    const targetMetToday = newMilliliter >= user.milliliterTarget

    if (targetMetToday && !targetMetBefore) {
      if (user.streak > 0 && user.streakStart) {
        const lastCompletedDate = user.streakStart.plus({ days: user.streak - 1 })
        const yesterday = DateTime.now().minus({ days: 1 }).startOf('day')
        const lastCompletedStart = lastCompletedDate.startOf('day')
        const diffDays = yesterday.diff(lastCompletedStart, 'days').days

        if (diffDays === 0) {
          user.streak += 1
        } else {
          user.streak = 1
          user.streakStart = DateTime.now()
        }
      } else {
        user.streak = 1
        user.streakStart = DateTime.now()
      }
      await user.save()
    }

    await DrinkLog.create({
      drinkId: drink.id,
      amountMl: amount,
    })

    return drink
  }

  static async recordDisconnect(user: User): Promise<void> {
    const todayStr = DateTime.now().toSQLDate()

    const drink = await Drink.query().where('userId', user.id).where('drinkDate', todayStr).first()

    const currentMl = drink ? drink.milliliter : 0

    user.deviceDisconnectedAt = DateTime.now()
    user.deviceDisconnectedMl = currentMl
    await user.save()
  }

  static async getSyncDelta(user: User): Promise<number> {
    const todayStr = DateTime.now().toSQLDate()

    const drink = await Drink.query().where('userId', user.id).where('drinkDate', todayStr).first()

    const currentMl = drink ? drink.milliliter : 0

    let delta = currentMl
    if (user.deviceDisconnectedAt && user.deviceDisconnectedAt.hasSame(DateTime.now(), 'day')) {
      delta = Math.max(0, currentMl - (user.deviceDisconnectedMl ?? 0))
    }

    return delta
  }
}
