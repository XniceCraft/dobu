import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('device_disconnected_at').nullable()
      table.integer('device_disconnected_ml').unsigned().nullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('device_disconnected_at')
      table.dropColumn('device_disconnected_ml')
    })
  }
}
