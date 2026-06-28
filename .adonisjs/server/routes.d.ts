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
    'family.leave': { paramsTuple?: []; params?: {} }
    'family.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'family.join': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device': { paramsTuple?: []; params?: {} }
    'device.pair': { paramsTuple?: []; params?: {} }
    'device.pair.store': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'drink.store': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'family.index': { paramsTuple?: []; params?: {} }
    'family.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device': { paramsTuple?: []; params?: {} }
    'device.pair': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'family.index': { paramsTuple?: []; params?: {} }
    'family.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device': { paramsTuple?: []; params?: {} }
    'device.pair': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'drink.create': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.birthdate': { paramsTuple?: []; params?: {} }
    'setting.weight': { paramsTuple?: []; params?: {} }
    'setting.days': { paramsTuple?: []; params?: {} }
    'setting.work-type': { paramsTuple?: []; params?: {} }
    'attachments': { paramsTuple: [ParamValue,ParamValue?]; params: {'key': ParamValue,'name'?: ParamValue} }
  }
  POST: {
    'auth.signup.store': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'family.store': { paramsTuple?: []; params?: {} }
    'family.leave': { paramsTuple?: []; params?: {} }
    'family.join': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'device.pair.store': { paramsTuple?: []; params?: {} }
    'drink.store': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}