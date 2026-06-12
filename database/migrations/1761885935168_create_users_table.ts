import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.date('birthdate').notNullable()
      table.integer('weight').unsigned().notNullable()
      table.time('day_start').notNullable()
      table.time('day_end').notNullable()
      table.enum('work_type', ['indoor', 'semi-outdoor', 'outdoor']).notNullable()
      table.integer('milliliter_target').unsigned().notNullable()
      table.json('avatar')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
