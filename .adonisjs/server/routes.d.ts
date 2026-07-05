import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.signup.store': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'family.index': { paramsTuple?: []; params?: {} }
    'family.store': { paramsTuple?: []; params?: {} }
    'family.invite': { paramsTuple?: []; params?: {} }
    'family.join': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'family.leave': { paramsTuple?: []; params?: {} }
    'device': { paramsTuple?: []; params?: {} }
    'device.disconnect': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'dress.update': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'drink.store': { paramsTuple?: []; params?: {} }
    'stats.index': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.height': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
    'setting.profile.update': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.characters.index': { paramsTuple?: []; params?: {} }
    'admin.characters.store': { paramsTuple?: []; params?: {} }
    'admin.characters.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.characters.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'family.index': { paramsTuple?: []; params?: {} }
    'family.invite': { paramsTuple?: []; params?: {} }
    'family.join': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'stats.index': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.height': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.characters.index': { paramsTuple?: []; params?: {} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'family.index': { paramsTuple?: []; params?: {} }
    'family.invite': { paramsTuple?: []; params?: {} }
    'family.join': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'stats.index': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.height': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.characters.index': { paramsTuple?: []; params?: {} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  POST: {
    'auth.signup.store': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'family.store': { paramsTuple?: []; params?: {} }
    'family.leave': { paramsTuple?: []; params?: {} }
    'device.disconnect': { paramsTuple?: []; params?: {} }
    'dress.update': { paramsTuple?: []; params?: {} }
    'drink.store': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
    'setting.profile.update': { paramsTuple?: []; params?: {} }
    'admin.characters.store': { paramsTuple?: []; params?: {} }
    'admin.characters.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.characters.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}