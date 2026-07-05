import vine from '@vinejs/vine'

const report = () => vine.string().maxLength(2048)

export const createIssueValidator = vine.create({
  report: report(),
})

export const updateIssueValidator = vine.create({
  report: report(),
  status: vine.enum(['open', 'closed']),
})
