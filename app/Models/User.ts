import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, beforeSave, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static readonly columns = [
    'id', 'nickname', 'email',
    'isEmailVerified', 'password', 'avatar',
    'birthday', 'phone', 'sex',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public nickname: string

  @column()
  public email: string

  @column()
  public isEmailVerified: boolean

  @column()
  public password: string

  @column()
  public avatar?: string

  @column()
  public birthday?: DateTime

  @column()
  public phone?: string

  @column()
  public sex?: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get isEmailVerifiedForUser(): string {
    return this.isEmailVerified ? 'Yes' : 'No'
  }

  @computed()
  public get sexForUser(): string {
    if (this.sex === true)
      return 'Woman'

    if (this.sex === false)
      return 'Man'

    return 'Not set'
  }

  @computed()
  public get birthdayForUser(): string {
    if (this.birthday)
      return this.birthday.toFormat(DEFAULT_DATETIME_FORMAT)

    return 'Not set'
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt?.toFormat(DEFAULT_DATETIME_FORMAT)
  }

  /**
   * * Hooks
   */

  @beforeSave()
  public static async hashPassword(item: User) {
    if (item.$dirty.password)
      item.password = await Hash.make(item.password)
  }
}
