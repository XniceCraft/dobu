/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('signup', [controllers.auth.SignUp, 'create']).as('auth.signup')
    router.post('signup', [controllers.auth.SignUp, 'store']).as('auth.signup.store')

    router.get('login', [controllers.auth.Session, 'create']).as('auth.login')
    router.post('login', [controllers.auth.Session, 'store']).as('auth.login.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.auth.Session, 'destroy']).as('auth.logout')

    router.get('/', [controllers.Page, 'home']).as('home')
    router.get('/family', [controllers.Family, 'index']).as('family.index')
    router.post('/family', [controllers.Family, 'store']).as('family.store')
    router.post('/family/leave', [controllers.Family, 'leave']).as('family.leave')
    router.get('/family/:slug', [controllers.Family, 'show']).as('family.show')
    router.post('/family/:slug', [controllers.Family, 'join']).as('family.join')
    router.get('/device', [controllers.Page, 'device']).as('device')
    router.get('/device/pair', [controllers.Bottle, 'showPair']).as('device.pair')
    router.post('/device/pair', [controllers.Bottle, 'store']).as('device.pair.store')
    router.get('/dress', [controllers.Page, 'dress']).as('dress')

    router
      .group(() => {
        router.get('/', [controllers.Drink, 'create']).as('drink.create')
        router.post('/', [controllers.Drink, 'store']).as('drink.store')
      })
      .prefix('/drink')

    router
      .group(() => {
        router.on('/').renderInertia('setting', {}).as('setting')

        router.get('/account', [controllers.Account, 'show']).as('setting.account')
        router.get('/birthdate', [controllers.Account, 'showBirthdate']).as('setting.birthdate')
        router.get('/weight', [controllers.Account, 'showWeight']).as('setting.weight')
        router.get('/days', [controllers.Account, 'showDays']).as('setting.days')
        router.get('/work-type', [controllers.Account, 'showWorkType']).as('setting.work-type')

        router.post('/account', [controllers.Account, 'update']).as('setting.account.update')
      })
      .prefix('/setting')

    router
      .group(() => {
        router
          .group(() => {
            router.get('/', [controllers.admin.Characters, 'index']).as('admin.characters.index')
            router.post('/', [controllers.admin.Characters, 'store']).as('admin.characters.store')
          })
          .prefix('/characters')
      })
      .prefix('/admin')
  })
  .use(middleware.auth())

router.attachments()
