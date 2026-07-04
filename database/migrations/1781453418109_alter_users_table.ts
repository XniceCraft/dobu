import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('character_id').unsigned().references('characters.id').nullable()
      table.integer('family_id').unsigned().references('families.id').nullable()
      table.integer('streak').notNullable().defaultTo(0)
      table.date('streak_start').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('character_id')
      table.dropColumn('family_id')
      table.dropColumn('streak')
      table.dropColumn('streak_start')
    })
  }
}
