import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { GENRES_DESCRIPTION_LENGTH } from 'Config/database'

export default class Genres extends BaseSchema {
  protected tableName = 'genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').unique().notNullable()
      table.string('name').unique().notNullable()
      table.string('description', GENRES_DESCRIPTION_LENGTH).notNullable()
      table.string('image').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
