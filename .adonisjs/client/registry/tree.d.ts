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
  family: {
    index: typeof routes['family.index']
    store: typeof routes['family.store']
    leave: typeof routes['family.leave']
    show: typeof routes['family.show']
    join: typeof routes['family.join']
  }
  device: typeof routes['device'] & {
    control: typeof routes['device.control']
    pair: {
      store: typeof routes['device.pair.store']
    }
  }
  dress: typeof routes['dress'] & {
    update: typeof routes['dress.update']
  }
  drink: {
    create: typeof routes['drink.create']
    store: typeof routes['drink.store']
  }
  setting: typeof routes['setting'] & {
    account: typeof routes['setting.account'] & {
      update: typeof routes['setting.account.update']
    }
    birthdate: typeof routes['setting.birthdate']
    weight: typeof routes['setting.weight']
    days: typeof routes['setting.days']
    workType: typeof routes['setting.work-type']
  }
  admin: {
    characters: {
      index: typeof routes['admin.characters.index']
      store: typeof routes['admin.characters.store']
    }
  }
  attachments: typeof routes['attachments']
}
