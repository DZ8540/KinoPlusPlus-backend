import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { VIDEO_COMMENTS_DESCRIPTION_LENGTH } from 'Config/database'

export default class VideosComments extends BaseSchema {
  protected tableName = 'videosComments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('description', VIDEO_COMMENTS_DESCRIPTION_LENGTH).notNullable()

      /**
       * * Foreign keys
       */

      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('video_id').unsigned().notNullable().references('videos.id')

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
