import Drink from '#models/drink'
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

export async function getWeekDrinkLogs(userId: number): Promise<Record<string, boolean>> {
  const today = DateTime.now()
  const monday = today.startOf('week')
  const sunday = monday.plus({ days: 6 }).endOf('day')

  const rows = await Drink.query()
    .where('userId', userId)
    .whereBetween('drinkDate', [monday.toISODate(), sunday.toISODate()])
    .select('drinkDate')

  const loggedDates = new Set(rows.map((r) => r.drinkDate.toISODate()))

  return Object.fromEntries(
    Array.from({ length: 7 }, (_, i) => {
      const dateKey = monday.plus({ days: i }).toISODate()!
      return [dateKey, loggedDates.has(dateKey)]
    })
  )
}

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

export function calculateMilliliterTarget(params: {
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
