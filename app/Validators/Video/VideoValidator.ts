import Video from 'App/Models/Video/Video'
import BaseValidator from '../BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DEFAULT_DATETIME_FORMAT } from 'Config/app'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  getVideoDescriptionRules, getVideoImageRules, getVideoNameRules,
  getVideoPosterRules, getVideoRatingRules, getVideoReleasedRules,
  getVideoSlugRules,
} from '../Rules/Video/videoRules'

export default class VideoValidator extends BaseValidator {
  private readonly currentVideoId?: Video['id'] = this.ctx.params.id

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ trim: true }, getVideoNameRules()),
    description: schema.string({ trim: true }, getVideoDescriptionRules()),
    released: schema.date({ format: DEFAULT_DATETIME_FORMAT }, getVideoReleasedRules()),
    country: schema.string({ trim: true }),
    rating: schema.number(getVideoRatingRules()),

    /**
     * * Optional schemes
     */

    slug: schema.string.optional({ trim: true }, getVideoSlugRules(this.currentVideoId)),
    poster: schema.string.optional({ trim: true }, getVideoPosterRules()),
    firstImage: schema.string.optional({ trim: true }, getVideoImageRules()),
    secondImage: schema.string.optional({ trim: true }, getVideoImageRules()),
    thirdImage: schema.string.optional({ trim: true }, getVideoImageRules()),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = this.messages
}
