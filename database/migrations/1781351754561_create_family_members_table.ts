import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'family_members'

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
      table
        .integer('family_id')
        .unsigned()
        .references('families.id')
        .onDelete('cascade')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
