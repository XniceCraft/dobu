import Drink from '#models/drink'
import DrinkLog from '#models/drink_log'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

import type User from '#models/user'
import type UserProfile from '#models/user_profile'

interface CalculateMilliliterTargetType {
  birthdate: DateTime
  weight: number
  height: number
  gender: 'male' | 'female'
  workType: 'indoor' | 'semi-outdoor' | 'outdoor'
  climate: 'cold' | 'temperate' | 'hot' | 'tropical'
  dayStart: string
  dayEnd: string
}

const INTERVAL_MINUTES_BY_WORK_TYPE: Record<UserProfile['workType'], number> = {
  'indoor': 60,
  'semi-outdoor': 45,
  'outdoor': 30,
}

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
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export class DrinkService {
  static async getTodayDrink(userId: number) {
    const drink = await Drink.firstOrCreate(
      {
        userId,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        totalMl: 0,
      }
    )

    return drink
  }

  static async getTodayDrinkLogs(userId: number): Promise<DrinkLog[]> {
    const startOfToday = DateTime.now().startOf('day')
    const endOfToday = DateTime.now().endOf('day')

    return await DrinkLog.query()
      .where('userId', userId)
      .whereBetween('createdAt', [startOfToday.toSQL()!, endOfToday.toSQL()!])
      .orderBy('createdAt', 'asc')
  }

  /**
   * Generates a calendar of the user's drink totals for the current week.
   * @param user The user to generate the calendar for.
   * @returns Promise<Record<string, number>> A map of dates to drink totals.
   *   - 0: No drink at all
   *   - 1: Less than 100% of target
   *   - 2: 100% or more than target
   */
  static async getCalendar(user: User, month?: number): Promise<Record<string, number>> {
    await user.loadOnce('drinkPreference')
    const target = user.drinkPreference.targetMl

    const today = DateTime.now()
    const monday = month ? DateTime.fromObject({ month }).startOf('month') : today.startOf('week')

    const rows = await Drink.query()
      .where('userId', user.id)
      .whereBetween('drinkDate', [monday.toISODate()!, today.toISODate()!])

    const totalsByDate = new Map<string, number>()
    for (const row of rows) {
      const key = row.drinkDate.toISODate()!
      totalsByDate.set(key, (totalsByDate.get(key) ?? 0) + row.totalMl)
    }

    return Object.fromEntries(
      Array.from({ length: today.diff(monday, 'days').days + 1 }, (_, i) => {
        const dateKey = monday.plus({ days: i }).toISODate()!
        const total = totalsByDate.get(dateKey) ?? 0
        return [dateKey, +(0 < target) + +(target <= total)]
      })
    )
  }

  static async getOrUpdateStreak(user: User): Promise<number> {
    await user.loadOnce('drinkPreference')

    if (user.drinkPreference.streak > 0 && user.drinkPreference.streakStart) {
      const lastCompletedDate = user.drinkPreference.streakStart.plus({
        days: user.drinkPreference.streak - 1,
      })
      const today = DateTime.now().startOf('day')
      const lastCompletedStart = lastCompletedDate.startOf('day')
      const diffDays = today.diff(lastCompletedStart, 'days').days

      if (diffDays > 1) {
        user.drinkPreference.streak = 0
        user.drinkPreference.streakStart = null
        await user.drinkPreference.save()

        return 0
      }

      return user.drinkPreference.streak
    }
    return 0
  }

  static calculateMilliliterTarget(params: CalculateMilliliterTargetType): number {
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

  static async generateUserDrink(user: User, params?: CalculateMilliliterTargetType) {
    if (!params) await user.loadOnce('profile')
    await user.loadOnce('drinkPreference')

    if (!params && !user.profile) {
      logger.error('Missing parameters to generate user drink: ', {
        params,
        userProfile: user.profile,
      })
      return
    }

    const workType = params !== undefined ? params.workType : user.profile.workType
    const dayStart = params !== undefined ? params.dayStart : user.profile.dayStart
    const dayEnd = params !== undefined ? params.dayEnd : user.profile.dayEnd

    const intervalMinutes = INTERVAL_MINUTES_BY_WORK_TYPE[workType]
    const startMinutes = timeToMinutes(dayStart)
    const endMinutes = timeToMinutes(dayEnd)
    const duration = endMinutes - startMinutes

    const drinkCount = Math.floor(duration / intervalMinutes)
    const targetMl = this.calculateMilliliterTarget(params ?? user.profile)
    const targetPerInterval = Math.round(targetMl / drinkCount)

    if (user.drinkPreference) {
      user.drinkPreference.drinkCount = drinkCount
      user.drinkPreference.targetPerInterval = targetPerInterval
      user.drinkPreference.targetMl = targetMl
      user.drinkPreference.intervalMinutes = intervalMinutes
      await user.drinkPreference.save()
      return
    }

    await user.related('drinkPreference').create({
      targetMl,
      intervalMinutes,
      drinkCount,
      targetPerInterval,
      streak: 0,
      streakStart: null,
    })
  }

  static async logDrink(user: User, amount: number): Promise<Drink> {
    await user.loadOnce('drinkPreference')

    const drink = await Drink.firstOrCreate(
      {
        userId: user.id,
        drinkDate: DateTime.now().toSQLDate() as unknown as DateTime,
      },
      {
        totalMl: 0,
      }
    )

    const oldMilliliter = drink.totalMl
    drink.totalMl += amount
    await drink.save()

    const newMilliliter = drink.totalMl
    const targetMetBefore = oldMilliliter >= user.drinkPreference.targetMl
    const targetMetToday = newMilliliter >= user.drinkPreference.targetMl

    if (targetMetToday && !targetMetBefore) {
      if (user.drinkPreference.streak > 0 && user.drinkPreference.streakStart) {
        const lastCompletedDate = user.drinkPreference.streakStart.plus({
          days: user.drinkPreference.streak - 1,
        })
        const yesterday = DateTime.now().minus({ days: 1 }).startOf('day')
        const lastCompletedStart = lastCompletedDate.startOf('day')
        const diffDays = yesterday.diff(lastCompletedStart, 'days').days

        if (diffDays === 0) {
          user.drinkPreference.streak += 1
        } else {
          user.drinkPreference.streak = 1
          user.drinkPreference.streakStart = DateTime.now()
        }
      } else {
        user.drinkPreference.streak = 1
        user.drinkPreference.streakStart = DateTime.now()
      }
      await user.drinkPreference.save()
    }

    await DrinkLog.create({
      userId: user.id,
      amountMl: amount,
    })

    return drink
  }

  static async recordDisconnect(user: User): Promise<void> {
    await user.loadOnce('drinkPreference')
    await user.loadOnce('bottle')

    const todayStr = DateTime.now().toSQLDate()

    const drink = await Drink.query().where('userId', user.id).where('drinkDate', todayStr).first()

    const currentMl = drink ? drink.totalMl : 0

    user.bottle.disconnectedAt = DateTime.now()
    user.bottle.disconnectedMl = currentMl
    await user.save()
  }

  static async getBottleDelta(user: User): Promise<number> {
    await user.loadOnce('bottle')

    const drink = await this.getTodayDrink(user.id)

    let delta = drink.totalMl
    if (!user.bottle) return 0

    if (user.bottle.disconnectedAt && user.bottle.disconnectedAt.hasSame(DateTime.now(), 'day')) {
      delta = Math.max(0, drink.totalMl - (user.bottle.disconnectedMl ?? 0))
    }

    return delta
  }
}
