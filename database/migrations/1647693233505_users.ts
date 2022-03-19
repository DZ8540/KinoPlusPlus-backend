import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('nickname').unique().notNullable()
      table.string('email').unique().notNullable()
      table.boolean('isEmailVerified').defaultTo(0).comment('0 - почта не подтверждена, 1 - почта подтверждена')
      table.string('password').notNullable()

      /**
       * * Nullable columns
       */

      table.string('avatar').nullable()
      table.date('birthday').nullable()
      table.string('phone').unique().nullable()
      table.boolean('sex').nullable().comment('0 - мужчина, 1 - женщина')

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
