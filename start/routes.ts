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
    router.get('/device', [controllers.Page, 'device']).as('device')
    router.on('/tracking').renderInertia('tracking', {}).as('tracking')
    router.on('/dress').renderInertia('dress', {}).as('dress')

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
        router.post('/account', [controllers.Account, 'update']).as('setting.account.update')
      })
      .prefix('/setting')
  })
  .use(middleware.auth())
