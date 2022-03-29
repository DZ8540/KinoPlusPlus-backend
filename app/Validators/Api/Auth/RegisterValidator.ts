import BaseValidator from 'App/Validators/BaseValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator extends BaseValidator {
  private readonly table: string = 'users'

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
    nickname: schema.string({}, [
      rules.unique({ table: this.table, column: 'nickname' }),
      rules.minLength(3),
      rules.maxLength(20),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: this.table, column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(30),
      rules.confirmed('passwordConfirm'),
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
