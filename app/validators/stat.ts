import vine from '@vinejs/vine'

export const queryStatsValidator = vine.create({
  month: vine.number().min(1).max(12).optional(),
  groupBy: vine.enum(['month', 'year']).optional(),
})
