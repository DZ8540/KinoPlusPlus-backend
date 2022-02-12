import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { camelCase } from '../../helpers'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { BaseModel, beforeSave, column, computed } from '@ioc:Adonis/Lucid/Orm'

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

  @column()
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get releasedForUser(): string {
    return this.released.toFormat('dd.MM.yyyy')
  }

  @computed()
  public get posterForUser(): string {
    return this.poster ?? IMG_PLACEHOLDER
  }

  @computed()
  public get firstImageForUser(): string {
    return this.firstImage ?? IMG_PLACEHOLDER
  }

  @computed()
  public get secondImageForUser(): string {
    return this.secondImage ?? IMG_PLACEHOLDER
  }

  @computed()
  public get thirdImageForUser(): string {
    return this.thirdImage ?? IMG_PLACEHOLDER
  }

  @beforeSave()
  public static async setSlug(video: Video) {
    if (video.$dirty.slug)
      video.slug = camelCase(video.slug)

    if (!video.slug)
      video.slug = camelCase(`${video.name} ${video.released.year}`)
  }

  @beforeSave()
  public static async setDuration(video: Video) {
    // @ts-ignore
    video.duration = video.duration.toISOTime()
  }
}
