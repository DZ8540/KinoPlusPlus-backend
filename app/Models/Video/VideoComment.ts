import Video from './Video'
import User from '../User/User'
import { DateTime } from 'luxon'
import {
  BaseModel, beforeFetch, beforeFind,
  BelongsTo, belongsTo, column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class VideoComment extends BaseModel {
  public static readonly table: string = 'videosComments'
  public static readonly columns = [
    'id', 'description', 'videoId',
    'userId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'video_id' })
  public videoId: Video['id']

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
  public static preloadRelations(query: ModelQueryBuilderContract<typeof VideoComment>) {
    query.preload('user')
  }
}
