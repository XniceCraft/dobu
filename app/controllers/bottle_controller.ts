import type { HttpContext } from '@adonisjs/core/http'

export default class BottleController {
  async showPair({ inertia }: HttpContext) {
    return inertia.render('device/pair', {})
  }

  async store() {}
}
