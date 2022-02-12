import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').unique().notNullable()
      table.string('name').notNullable()
      table.string('description', 8192).notNullable()
      table.integer('ageLimit').unsigned().defaultTo(0).notNullable()
      table.date('released').notNullable()
      table.string('country').notNullable()
      // table.string('director').notNullable()
      table.decimal('rating', 2, 1).unsigned().notNullable().comment('Only from 1 to 10')
      table.time('duration').notNullable()
      table.integer('viewsCount').unsigned().defaultTo(0).notNullable()
      table.boolean('isSerial').defaultTo(0).notNullable()
      table.string('firstImage').nullable()
      table.string('secondImage').nullable()
      table.string('thirdImage').nullable()
      table.string('trailer').nullable()
      table.string('poster').nullable()

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
