import Genre from './Genre'
import User from '../User/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { camelCase } from 'Helpers/index'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import {
  BaseModel, beforeCreate, beforeSave,
  column, computed, ManyToMany,
  manyToMany, ModelObject
} from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  public static readonly columns = [
    'id', 'slug', 'name',
    'description', 'released', 'country',
    'rating', 'viewsCount', 'isSerial',
    'firstImage', 'secondImage', 'thirdImage',
    'trailer', 'poster', 'createdAt',
    'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public ageLimit: number

  @column.date()
  public released: DateTime

  @column()
  public country: string

  @column()
  public rating: number

  @column()
  public duration: DateTime

  @column()
  public viewsCount: number

  @column({ serializeAs: null })
  public isSerial: boolean

  @column()
  public firstImage: string | undefined

  @column()
  public secondImage: string | undefined

  @column()
  public thirdImage: string | undefined

  @column()
  public trailer: string | undefined

  @column()
  public poster: string | undefined

  @column.dateTime({
    autoCreate: true,
    serializeAs: null,
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @manyToMany(() => Genre, { pivotTable: 'genres_videos' })
  public genres: ManyToMany<typeof Genre>

  /**
   * * Computed properties
   */

  @computed()
  public get releasedForUser(): string {
    return this.released.toFormat(DEFAULT_DATETIME_FORMAT)
  }

  /**
   * * Hooks
   */

  @beforeCreate()
  public static async setDuration(video: Video) {
    // @ts-ignore
    video.duration = video.duration.toISOTime()
  }

  @beforeSave()
  public static async setSlug(video: Video) {
    if (video.$dirty.slug)
      video.slug = camelCase(video.slug)

    if (!video.slug)
      video.slug = camelCase(`${video.name} ${video.released.year}`)
  }

  /**
   * * Other properties
   */

  public serializeForSinglePage(): ModelObject {
    return this.serialize({
      relations: {
        genres: {
          fields: ['id', 'slug', 'name']
        }
      }
    })
  }

  public async getForUser(userId: User['id']) {
    const video: ModelObject = { ...this.toJSON() }

    const isWishlist = await Database
      .from('wishlists')
      .where('user_id', userId)
      .andWhere('video_id', video.id)
      .first()

    video.wishlistStatus = Boolean(isWishlist)

    return video
  }
}
