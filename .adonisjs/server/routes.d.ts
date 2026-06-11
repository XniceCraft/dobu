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
    'device': { paramsTuple?: []; params?: {} }
    'tracking': { paramsTuple?: []; params?: {} }
    'drink': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'device': { paramsTuple?: []; params?: {} }
    'tracking': { paramsTuple?: []; params?: {} }
    'drink': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'device': { paramsTuple?: []; params?: {} }
    'tracking': { paramsTuple?: []; params?: {} }
    'drink': { paramsTuple?: []; params?: {} }
    'dress': { paramsTuple?: []; params?: {} }
    'setting': { paramsTuple?: []; params?: {} }
    'setting.account': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.signup.store': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'setting.account.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}