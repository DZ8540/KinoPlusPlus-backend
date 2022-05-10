import Genre from 'App/Models/Video/Genre'
import BaseValidator from './BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  getGenreDescriptionRules, getGenreImageOptions,
  getGenreNameRules, getGenreSlugRules
} from './Rules/genreRules'

export default class GenreValidator extends BaseValidator {
  private currentSlug?: Genre['slug'] = this.ctx.params.id

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
    name: schema.string({ trim: true }, getGenreNameRules(this.currentSlug)),
    description: schema.string({ trim: true }, getGenreDescriptionRules()),

    /**
     * * Optional schemes
     */

    slug: schema.string.optional({ trim: true }, getGenreSlugRules(this.currentSlug)),
    image: schema.file.optional(getGenreImageOptions()),
    isShowOnMainPage: schema.boolean.optional(),
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
