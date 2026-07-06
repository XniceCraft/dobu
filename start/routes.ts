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

    router.get('/', [controllers.Home, 'index']).as('home')

    router.get('/family', [controllers.Family, 'index']).as('family.index')
    router.post('/family', [controllers.Family, 'store']).as('family.store')
    router.get('/family/invite', [controllers.Family, 'invite']).as('family.invite')
    router.get('/family/:slug', [controllers.Family, 'join']).as('family.join')
    router.post('/family/leave', [controllers.Family, 'leave']).as('family.leave')

    router.get('/device', [controllers.Bottles, 'index']).as('device')
    router.post('/device/disconnect', [controllers.Bottles, 'disconnect']).as('device.disconnect')

    router.get('/dress', [controllers.Characters, 'index']).as('dress')
    router.post('/dress', [controllers.Characters, 'update']).as('dress.update')

    router.get('/share', [controllers.Shares, 'index']).as('share.index')

    router
      .group(() => {
        router.get('/', [controllers.Drink, 'create']).as('drink.create')
        router.post('/', [controllers.Drink, 'store']).as('drink.store')
      })
      .prefix('/drink')

    router.get('/stats', [controllers.Stats, 'index']).as('stats.index')

    router
      .group(() => {
        router.get('/', [controllers.Settings, 'index']).as('setting')

        router.get('/account', [controllers.Account, 'show']).as('setting.account')
        router.get('/birthdate', [controllers.Account, 'showBirthdate']).as('setting.birthdate')
        router.get('/weight', [controllers.Account, 'showWeight']).as('setting.weight')
        router.get('/height', [controllers.Account, 'showHeight']).as('setting.height')
        router.get('/days', [controllers.Account, 'showDays']).as('setting.days')
        router.get('/work-type', [controllers.Account, 'showWorkType']).as('setting.work-type')

        router.post('/account', [controllers.Account, 'update']).as('setting.account.update')
        router.post('/profile', [controllers.Profile, 'update']).as('setting.profile.update')
      })
      .prefix('/setting')

    router
      .group(() => {
        router.get('/', [controllers.admin.Dashboard, 'index']).as('admin.dashboard')

        router
          .group(() => {
            router.get('/', [controllers.admin.Characters, 'index']).as('admin.characters.index')
            router.post('/', [controllers.admin.Characters, 'store']).as('admin.characters.store')
            router
              .post('/:id', [controllers.admin.Characters, 'update'])
              .as('admin.characters.update')
            router
              .post('/:id/delete', [controllers.admin.Characters, 'destroy'])
              .as('admin.characters.destroy')
          })
          .prefix('/characters')
      })
      .prefix('/admin')
      .use(middleware.ensureAdmin())
  })
  .use(middleware.auth())

router.attachments()
