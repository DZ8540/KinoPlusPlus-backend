import Room from './Room'
import User from '../User/User'
import { DateTime } from 'luxon'
import {
  afterCreate, BaseModel, beforeFetch,
  beforeFind, BelongsTo, belongsTo,
  column, ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class RoomMessage extends BaseModel {
  public static readonly table: string = 'roomsMessages'
  public static readonly columns = [
    'id', 'message', 'userId',
    'roomId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'room_id' })
  public roomId: Room['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof RoomMessage>) {
    query.preload('user')
  }

  @afterCreate()
  public static async loadRelations(item: RoomMessage) {
    await item.load('user')
  }
}
