import Role from './Role'
import Token from './Token'
import Video from '../Video/Video'
import Hash from '@ioc:Adonis/Core/Hash'
import RoleService from 'App/Services/User/RoleService'
import { DateTime } from 'luxon'
import { Err } from 'Contracts/services'
import { TablesNames } from 'Config/database'
import { RoleTypes, ROLE_TYPES } from 'Config/role'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import {
  BaseModel, beforeCreate, beforeSave,
  BelongsTo, belongsTo, column,
  computed, HasMany, hasMany,
  manyToMany, ManyToMany,
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

  @manyToMany(() => Video, { pivotTable: TablesNames.WISHLISTS })
  public wishlist: ManyToMany<typeof Video>

  @manyToMany(() => Video, { pivotTable: TablesNames.LATER_LISTS })
  public laterList: ManyToMany<typeof Video>

  @manyToMany(() => Video, { pivotTable: TablesNames.HISTORY_LISTS })
  public historyList: ManyToMany<typeof Video>

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
      } catch (err: Err | any) {
        throw err
      }
    }
  }
}
