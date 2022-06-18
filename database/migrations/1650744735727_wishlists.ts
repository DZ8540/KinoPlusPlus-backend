import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TablesNames } from 'Config/database'

export default class Wishlists extends BaseSchema {
  protected tableName = TablesNames.WISHLISTS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().notNullable().references(`${TablesNames.USERS}.id`)
      table.integer('video_id').unsigned().notNullable().references(`${TablesNames.VIDEOS}.id`)
      table.unique(['user_id', 'video_id'])

      /**
       * * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
