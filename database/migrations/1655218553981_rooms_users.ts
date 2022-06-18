import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TablesNames } from 'Config/database'

export default class RoomsUsers extends BaseSchema {
  protected tableName = TablesNames.ROOMS_USERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isCreator').defaultTo(0).notNullable()

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().notNullable().references(`${TablesNames.USERS}.id`)
      table.integer('room_id').unsigned().notNullable().references(`${TablesNames.ROOMS}.id`)
      table.unique(['user_id', 'room_id'])

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
