import env from '#start/env'
import { defineConfig, store, drivers } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: env.get('CACHE_STORE'),

  stores: {
    memoryOnly: store().useL1Layer(drivers.memory({ maxSize: '100MB' })),
    database: store()
      .useL1Layer(drivers.memory({ maxSize: '100MB' }))
      .useL2Layer(
        drivers.database({
          connectionName: 'mysql',
          autoCreateTable: false,
          tableName: 'cache',
        })
      ),
    databaseOnly: store().useL2Layer(
      drivers.database({
        connectionName: 'mysql',
        autoCreateTable: false,
        tableName: 'cache',
      })
    ),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
