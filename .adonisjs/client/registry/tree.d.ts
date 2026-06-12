/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  auth: {
    signup: typeof routes['auth.signup'] & {
      store: typeof routes['auth.signup.store']
    }
    login: typeof routes['auth.login'] & {
      store: typeof routes['auth.login.store']
    }
    logout: typeof routes['auth.logout']
  }
  home: typeof routes['home']
  device: typeof routes['device']
  tracking: typeof routes['tracking']
  dress: typeof routes['dress']
  drink: {
    create: typeof routes['drink.create']
    store: typeof routes['drink.store']
  }
  setting: typeof routes['setting'] & {
    account: typeof routes['setting.account'] & {
      update: typeof routes['setting.account.update']
    }
  }
}
