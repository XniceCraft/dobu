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
    invite: typeof routes['family.invite']
    join: typeof routes['family.join']
    leave: typeof routes['family.leave']
  }
  device: typeof routes['device'] & {
    disconnect: typeof routes['device.disconnect']
  }
  dress: typeof routes['dress'] & {
    update: typeof routes['dress.update']
  }
  share: {
    index: typeof routes['share.index']
  }
  leaderboard: {
    index: typeof routes['leaderboard.index']
  }
  drink: {
    create: typeof routes['drink.create']
    store: typeof routes['drink.store']
  }
  stats: {
    index: typeof routes['stats.index']
  }
  setting: typeof routes['setting'] & {
    bug: typeof routes['setting.bug'] & {
      store: typeof routes['setting.bug.store']
    }
    account: typeof routes['setting.account'] & {
      update: typeof routes['setting.account.update']
    }
    birthdate: typeof routes['setting.birthdate']
    weight: typeof routes['setting.weight']
    height: typeof routes['setting.height']
    days: typeof routes['setting.days']
    workType: typeof routes['setting.work-type']
    profile: {
      update: typeof routes['setting.profile.update']
    }
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
    characters: {
      index: typeof routes['admin.characters.index']
      store: typeof routes['admin.characters.store']
      update: typeof routes['admin.characters.update']
      destroy: typeof routes['admin.characters.destroy']
    }
  }
  attachments: typeof routes['attachments']
}
