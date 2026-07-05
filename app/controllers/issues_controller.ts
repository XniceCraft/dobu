import Issue from '#models/issue'
import { createIssueValidator } from '#validators/issue'

import type { HttpContext } from '@adonisjs/core/http'

export default class IssuesController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.use('web').user!
    const payload = await request.validateUsing(createIssueValidator)

    await Issue.create({
      userId: user.id,
      report: payload.report,
    })

    return response.redirect().back()
  }
}
