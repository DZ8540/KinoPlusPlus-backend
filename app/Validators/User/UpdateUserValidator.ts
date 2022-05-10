import User from 'App/Models/User/User'
import BaseValidator from '../BaseValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  getUserAvatarOptions, getUserEmailRules, getUserNicknameRules,
  getUserPasswordRules, getUserPhoneRules,
} from '../Rules/userRules'

export default class UpdateUserValidator extends BaseValidator {
  private readonly currentUserId?: User['id'] = this.ctx.params.id

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
    nickname: schema.string({ trim: true }, getUserNicknameRules(this.currentUserId)),
    email: schema.string({ trim: true }, getUserEmailRules(this.currentUserId, 'unique')),

    /**
     * * Optional schemes
     */

    avatar: schema.file.optional(getUserAvatarOptions()),
    phone: schema.string.optional({ trim: true }, getUserPhoneRules()),
    sex: schema.boolean.optional(),
    oldPassword: schema.string.optional({ trim: true }, getUserPasswordRules()),
    password: schema.string.optional({ trim: true }, [
      ...getUserPasswordRules(true),
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
