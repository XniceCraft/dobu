import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('character_id').unsigned().references('characters.id').nullable()
      table.integer('family_id').unsigned().references('families.id').nullable()
    })
  }

  async down() {}
}
