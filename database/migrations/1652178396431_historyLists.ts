import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TablesNames } from 'Config/database'

export default class HistoryLists extends BaseSchema {
  protected tableName = TablesNames.HISTORY_LISTS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().notNullable().references(`${TablesNames.USERS}.id`)
      table.integer('video_id').unsigned().notNullable().references(`${TablesNames.VIDEOS}.id`)

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
