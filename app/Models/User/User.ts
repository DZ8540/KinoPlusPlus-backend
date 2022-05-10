import Role from './Role'
import Token from './Token'
import Video from '../Video/Video'
import Hash from '@ioc:Adonis/Core/Hash'
import Drive from '@ioc:Adonis/Core/Drive'
import RoleService from 'App/Services/User/RoleService'
import { DateTime } from 'luxon'
import { Error } from 'Contracts/services'
import { RoleTypes, ROLE_TYPES } from 'Config/role'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import {
  BaseModel, beforeCreate, beforeSave,
  BelongsTo, belongsTo, column,
  computed, HasMany, hasMany,
  afterFetch, afterFind, manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

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

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar?: string

  @column()
  public birthday?: DateTime

  @column()
  public phone?: string

  @column()
  public sex?: boolean

  /**
   * * Foreign keys
   */

  @column({
    columnName: 'role_id',
    serializeAs: null,
  })
  public roleId: Role['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @manyToMany(() => Video, { pivotTable: 'wishlists' })
  public wishlist: ManyToMany<typeof Video>

  @manyToMany(() => Video, { pivotTable: 'laterLists' })
  public laterList: ManyToMany<typeof Video>

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

  @beforeCreate()
  public static async setRole(item: User) {
    if (!item.roleId) {
      const userRoleName: Role['name'] = ROLE_TYPES[RoleTypes.USER]

      try {
        const { id } = await RoleService.getByName(userRoleName)

        item.roleId = id
      } catch (err: Error | any) {
        throw err
      }
    }
  }

  @afterFind()
  public static async getImageFromDrive(item: User) {
    if (item.avatar)
      item.avatar = await Drive.getUrl(item.avatar)
  }

  @afterFetch()
  public static async getImagesFromDrive(users: User[]) {
    await Promise.all(users.map(async (item: User) => {
      if (item.avatar)
        item.avatar = await Drive.getUrl(item.avatar)
    }))
  }
}
