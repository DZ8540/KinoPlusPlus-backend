import User from '../User/User'
import Video from '../Video/Video'
import RoomMessage from './RoomMessage'
import { DateTime } from 'luxon'
import {
  BaseModel, beforeDelete, column,
  HasMany, hasMany, scope,
} from '@ioc:Adonis/Lucid/Orm'

export default class Room extends BaseModel {
  public static readonly columns = [
    'id', 'isOpen', 'slug',
    'userId', 'videoId', 'createdAt',
    'updatedAt',
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

  @column({ columnName: 'user_id' })
  public userId: User['id']

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
   * * Relations
   */

  @hasMany(() => RoomMessage)
  public messages: HasMany<typeof RoomMessage>

  /**
   * * Query scopes
   */

  public static opened = scope((query) => {
    query.where('isOpen', true)
  })

  /**
   * * Hooks
   */

  @beforeDelete()
  public static async deleteAllMessages(item: Room) {
    await item.related('messages').query().delete()
  }
}
