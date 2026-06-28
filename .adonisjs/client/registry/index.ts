/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'auth.signup': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.signup']['types'],
  },
  'auth.signup.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.signup.store']['types'],
  },
  'auth.login': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.login.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login.store']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'family.index': {
    methods: ["GET","HEAD"],
    pattern: '/family',
    tokens: [{"old":"/family","type":0,"val":"family","end":""}],
    types: placeholder as Registry['family.index']['types'],
  },
  'family.store': {
    methods: ["POST"],
    pattern: '/family',
    tokens: [{"old":"/family","type":0,"val":"family","end":""}],
    types: placeholder as Registry['family.store']['types'],
  },
  'family.leave': {
    methods: ["POST"],
    pattern: '/family/leave',
    tokens: [{"old":"/family/leave","type":0,"val":"family","end":""},{"old":"/family/leave","type":0,"val":"leave","end":""}],
    types: placeholder as Registry['family.leave']['types'],
  },
  'family.show': {
    methods: ["GET","HEAD"],
    pattern: '/family/:slug',
    tokens: [{"old":"/family/:slug","type":0,"val":"family","end":""},{"old":"/family/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['family.show']['types'],
  },
  'family.join': {
    methods: ["POST"],
    pattern: '/family/:slug',
    tokens: [{"old":"/family/:slug","type":0,"val":"family","end":""},{"old":"/family/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['family.join']['types'],
  },
  'device': {
    methods: ["GET","HEAD"],
    pattern: '/device',
    tokens: [{"old":"/device","type":0,"val":"device","end":""}],
    types: placeholder as Registry['device']['types'],
  },
  'device.pair': {
    methods: ["GET","HEAD"],
    pattern: '/device/pair',
    tokens: [{"old":"/device/pair","type":0,"val":"device","end":""},{"old":"/device/pair","type":0,"val":"pair","end":""}],
    types: placeholder as Registry['device.pair']['types'],
  },
  'device.pair.store': {
    methods: ["POST"],
    pattern: '/device/pair',
    tokens: [{"old":"/device/pair","type":0,"val":"device","end":""},{"old":"/device/pair","type":0,"val":"pair","end":""}],
    types: placeholder as Registry['device.pair.store']['types'],
  },
  'dress': {
    methods: ["GET","HEAD"],
    pattern: '/dress',
    tokens: [{"old":"/dress","type":0,"val":"dress","end":""}],
    types: placeholder as Registry['dress']['types'],
  },
  'drink.create': {
    methods: ["GET","HEAD"],
    pattern: '/drink',
    tokens: [{"old":"/drink","type":0,"val":"drink","end":""}],
    types: placeholder as Registry['drink.create']['types'],
  },
  'drink.store': {
    methods: ["POST"],
    pattern: '/drink',
    tokens: [{"old":"/drink","type":0,"val":"drink","end":""}],
    types: placeholder as Registry['drink.store']['types'],
  },
  'setting': {
    methods: ["GET","HEAD"],
    pattern: '/setting',
    tokens: [{"old":"/setting","type":0,"val":"setting","end":""}],
    types: placeholder as Registry['setting']['types'],
  },
  'setting.account': {
    methods: ["GET","HEAD"],
    pattern: '/setting/account',
    tokens: [{"old":"/setting/account","type":0,"val":"setting","end":""},{"old":"/setting/account","type":0,"val":"account","end":""}],
    types: placeholder as Registry['setting.account']['types'],
  },
  'setting.birthdate': {
    methods: ["GET","HEAD"],
    pattern: '/setting/birthdate',
    tokens: [{"old":"/setting/birthdate","type":0,"val":"setting","end":""},{"old":"/setting/birthdate","type":0,"val":"birthdate","end":""}],
    types: placeholder as Registry['setting.birthdate']['types'],
  },
  'setting.weight': {
    methods: ["GET","HEAD"],
    pattern: '/setting/weight',
    tokens: [{"old":"/setting/weight","type":0,"val":"setting","end":""},{"old":"/setting/weight","type":0,"val":"weight","end":""}],
    types: placeholder as Registry['setting.weight']['types'],
  },
  'setting.days': {
    methods: ["GET","HEAD"],
    pattern: '/setting/days',
    tokens: [{"old":"/setting/days","type":0,"val":"setting","end":""},{"old":"/setting/days","type":0,"val":"days","end":""}],
    types: placeholder as Registry['setting.days']['types'],
  },
  'setting.work-type': {
    methods: ["GET","HEAD"],
    pattern: '/setting/work-type',
    tokens: [{"old":"/setting/work-type","type":0,"val":"setting","end":""},{"old":"/setting/work-type","type":0,"val":"work-type","end":""}],
    types: placeholder as Registry['setting.work-type']['types'],
  },
  'setting.account.update': {
    methods: ["POST"],
    pattern: '/setting/account',
    tokens: [{"old":"/setting/account","type":0,"val":"setting","end":""},{"old":"/setting/account","type":0,"val":"account","end":""}],
    types: placeholder as Registry['setting.account.update']['types'],
  },
  'attachments': {
    methods: ["GET","HEAD"],
    pattern: '/attachments/:key/:name?',
    tokens: [{"old":"/attachments/:key/:name?","type":0,"val":"attachments","end":""},{"old":"/attachments/:key/:name?","type":1,"val":"key","end":""},{"old":"/attachments/:key/:name?","type":3,"val":"name","end":""}],
    types: placeholder as Registry['attachments']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
