import Genre from './Genre'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { camelCase } from '../../helpers/index'
import {
  BaseModel, beforeCreate, beforeSave,
  column, computed, ManyToMany,
  manyToMany, ModelObject
} from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'slug', 'name',
    'description', 'released', 'country',
    'rating', 'viewsCount', 'isSerial',
    'firstImage', 'secondImage', 'thirdImage',
    'trailer', 'poster', 'createdAt',
    'updatedAt',
  ] as const

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

  @column({ serializeAs: null })
  public firstImage: string | undefined

  @column({ serializeAs: null })
  public secondImage: string | undefined

  @column({ serializeAs: null })
  public thirdImage: string | undefined

  @column({ serializeAs: null })
  public trailer: string | undefined

  @column({ serializeAs: null })
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

  @manyToMany(() => Genre, {
    pivotTable: 'genres_videos',
  })
  public genres: ManyToMany<typeof Genre>

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
   * * Computed properties
   */

  @computed()
  public get releasedForUser(): string {
    return this.released.toFormat('dd.MM.yyyy')
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
}
