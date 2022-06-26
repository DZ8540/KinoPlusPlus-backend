import User from '../User/User'
import Video from '../Video/Video'
import RoomMessage from './RoomMessage'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { TablesNames } from 'Config/database'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import {
  BaseModel, beforeDelete, beforeFetch,
  beforeFind, belongsTo, BelongsTo,
  column, computed, HasMany,
  ModelQueryBuilderContract, scope, hasMany,
  manyToMany, ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

export default class Room extends BaseModel {
  public static readonly columns = [
    'id', 'isOpen', 'slug',
    'videoId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isOpen: boolean

  @column()
  public slug: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'video_id' })
  public videoId: Video['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Aggregate columns
   */

   @column({ columnName: 'users_count' })
   public usersCount?: number

  /**
   * * Relations
   */

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @hasMany(() => RoomMessage)
  public messages: HasMany<typeof RoomMessage>

  @manyToMany(() => User, { pivotTable: TablesNames.ROOMS_USERS })
  public users: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: TablesNames.ROOMS_USERS,
    onQuery(query) {
      query.where('isCreator', true)
    },
  })
  public creator: ManyToMany<typeof User>

  /**
   * * Computed properties
   */

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt?.toFormat(DEFAULT_DATETIME_FORMAT)
  }

  /**
   * * Query scopes
   */

  public static opened = scope((query) => {
    query.where('isOpen', true)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Room>) {
    query
      .withCount('users')
      .preload('creator')
      .preload('video')
      .preload('users')
  }

  @beforeDelete()
  public static async deleteAllMessages(item: Room) {
    const trx = await Database.transaction()

    await item.related('messages').query().delete()
    await item.related('users').detach([], trx)

    await trx.commit()
  }
}
