import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rooms extends BaseSchema {
  protected tableName = 'rooms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isOpen').defaultTo(1).notNullable()
      table.string('slug').unique().notNullable()

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('video_id').unsigned().notNullable().references('videos.id')
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
