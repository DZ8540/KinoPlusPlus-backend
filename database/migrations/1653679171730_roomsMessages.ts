import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoomsMessages extends BaseSchema {
  protected tableName = 'roomsMessages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('message').notNullable()

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().references('users.id')
      table.integer('room_id').unsigned().references('rooms.id')

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
