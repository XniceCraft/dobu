import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_drinks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('cascade')
        .notNullable()
        .unique()
      table.integer('target_ml').unsigned().notNullable()
      table.integer('interval_minutes').unsigned().notNullable()
      table.integer('drink_count').unsigned().notNullable()
      table.integer('target_per_interval').unsigned().notNullable()
      table.integer('streak').notNullable().defaultTo(0)
      table.date('streak_start').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
