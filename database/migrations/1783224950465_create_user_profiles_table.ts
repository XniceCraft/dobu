import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

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
      table.integer('weight').unsigned().notNullable()
      table.integer('height').unsigned().notNullable()
      table.date('birthdate').notNullable()
      table.time('day_start').notNullable()
      table.time('day_end').notNullable()
      table.enum('gender', ['male', 'female']).notNullable()
      table.enum('climate', ['cold', 'temperate', 'hot', 'tropical']).notNullable()
      table.enum('work_type', ['indoor', 'semi-outdoor', 'outdoor']).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
