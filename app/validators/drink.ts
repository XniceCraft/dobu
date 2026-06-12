import vine from '@vinejs/vine'

export const insertDrinkValidator = vine.create({
  amount: vine.number().min(50).max(2000),
})
