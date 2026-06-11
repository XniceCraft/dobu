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

    router.on('/').renderInertia('home', {}).as('home')
    router.on('/device').renderInertia('device', {}).as('device')
    router.on('/tracking').renderInertia('tracking', {}).as('tracking')
    router.on('/drink').renderInertia('drink', {}).as('drink')
    router.on('/dress').renderInertia('dress', {}).as('dress')
  })
  .use(middleware.auth())
