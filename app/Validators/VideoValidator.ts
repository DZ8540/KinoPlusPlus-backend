import BaseValidator from './BaseValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideoValidator extends BaseValidator {
  private readonly currentVideoId: number | null = this.ctx.params.id ?? null

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
      rules.maxLength(50),
      rules.minLength(4),
      rules.unique({ table: 'videos', column: 'slug', whereNot: { id: this.currentVideoId } }),
    ]),
    name: schema.string({}, [
      rules.maxLength(20),
      rules.minLength(2),
      rules.required(),
    ]),
    description: schema.string({}, [
      rules.maxLength(8192),
      rules.minLength(2),
      rules.required(),
    ]),
    released: schema.date({ format: 'dd.MM.yyyy' }, [
      rules.required(),
      rules.before('today'),
    ]),
    country: schema.string({}, [
      rules.required(),
    ]),
    rating: schema.number([
      rules.range(0, 10),
      rules.unsigned(),
    ]),
    poster: schema.string.optional({}, [
      rules.url(),
      rules.maxLength(255),
    ]),
    firstImage: schema.string.optional({}, [
      rules.url(),
      rules.maxLength(255),
    ]),
    secondImage: schema.string.optional({}, [
      rules.url(),
      rules.maxLength(255),
    ]),
    thirdImage: schema.string.optional({}, [
      rules.url(),
      rules.maxLength(255),
    ]),
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
