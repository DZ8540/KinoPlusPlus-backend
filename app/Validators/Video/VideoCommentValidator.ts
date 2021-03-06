import BaseValidator from '../BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getUserIdRules } from '../Rules/userRules'
import { getVideoIdRules } from '../Rules/Video/videoRules'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getVideoCommentDescriptionRules } from '../Rules/Video/videoCommentRules'

export default class VideoCommentValidator extends BaseValidator {
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
    userId: schema.number(getUserIdRules('exists')),
    videoId: schema.number(getVideoIdRules('exists')),
    description: schema.string({ trim: true }, getVideoCommentDescriptionRules())
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
