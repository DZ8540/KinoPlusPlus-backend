import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GenresVideos extends BaseSchema {
  protected tableName = 'genres_videos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('genre_id').unsigned().notNullable().references('genres.id')
      table.integer('video_id').unsigned().notNullable().references('videos.id')
      table.unique(['genre_id', 'video_id'])

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
