import BaseValidator from './BaseValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { GENRES_DESCRIPTION_LENGTH } from 'Config/database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GenreValidator extends BaseValidator {
  private currentSlug: string | null = this.ctx.params.id ?? null
  private readonly table: string = 'genres'

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
    slug: schema.string.optional({}, [
      rules.minLength(2),
      rules.maxLength(255),
      rules.unique({ table: this.table, column: 'slug', whereNot: { slug: this.currentSlug } }),
    ]),
    name: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(255),
      rules.unique({ table: this.table, column: 'name', whereNot: { slug: this.currentSlug } }),
    ]),
    description: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(GENRES_DESCRIPTION_LENGTH),
    ]),
    image: schema.file.optional({
      extnames: ['png', 'jpeg', 'jpg', 'webp'],
    }),
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
