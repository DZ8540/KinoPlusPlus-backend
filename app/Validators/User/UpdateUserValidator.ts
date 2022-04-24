import User from 'App/Models/User/User'
import BaseValidator from '../BaseValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator extends BaseValidator {
  private readonly table: string = 'users'
  private readonly currentUserId: User['id'] | null = this.ctx.params.id ?? null

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
    nickname: schema.string({ trim: true }, [
      rules.unique({ table: this.table, column: 'nickname', whereNot: { id: this.currentUserId } }),
      rules.maxLength(255),
    ]),
    email: schema.string({ trim: true }, [
      rules.unique({ table: this.table, column: 'email', whereNot: { id: this.currentUserId } }),
      rules.email(),
    ]),

    /**
     * * Optional schemes
     */

    avatar: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    phone: schema.string.optional({ trim: true }, [
      rules.mobile(),
    ]),
    sex: schema.boolean.optional(),
    oldPassword: schema.string.optional({ trim: true }, [
      rules.containNumber(),
      rules.containUppercase(),
      rules.minLength(8),
      rules.maxLength(30),
    ]),
    password: schema.string.optional({ trim: true }, [
      rules.containNumber(),
      rules.containUppercase(),
      rules.minLength(8),
      rules.maxLength(30),
      rules.confirmed('passwordConfirm'),
      rules.requiredIfExists('oldPassword'),
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
