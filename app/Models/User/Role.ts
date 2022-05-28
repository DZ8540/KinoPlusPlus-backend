import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {
  public static readonly columns = ['id', 'name', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Hooks
   */

  @beforeSave()
  public static nameToLowerCase(item: Role) {
    if (item.$dirty.name)
      item.name = item.name.toLowerCase()
  }
}
