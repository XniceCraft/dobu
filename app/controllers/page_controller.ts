import type { HttpContext } from '@adonisjs/core/http'

export default class PageController {
  async home({ auth, inertia }: HttpContext) {
    const user = auth.use('web').user!

    return inertia.render('home', {
      user,
    })
  }
}
