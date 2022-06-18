import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TablesNames } from 'Config/database'

export default class GenresVideos extends BaseSchema {
  protected tableName = TablesNames.GENRES_VIDEOS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Foreign keys
       */

      table.integer('genre_id').unsigned().notNullable().references(`${TablesNames.GENRES}.id`)
      table.integer('video_id').unsigned().notNullable().references(`${TablesNames.VIDEOS}.id`)
      table.unique(['genre_id', 'video_id'])

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
