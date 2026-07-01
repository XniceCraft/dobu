import type { HttpContext } from '@adonisjs/core/http'

export default class BottleController {
  async control({ inertia }: HttpContext) {
    return inertia.render('device/control', {})
  }

  async store() {}
}
