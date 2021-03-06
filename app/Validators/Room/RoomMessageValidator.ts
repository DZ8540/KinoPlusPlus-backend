import BaseValidator from '../BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getUserIdRules } from '../Rules/userRules'
import { getRoomIdRules } from '../Rules/Room/roomRules'
import { getMessageRules } from '../Rules/Room/messageRules'

export default class RoomMessageValidator extends BaseValidator {
  constructor() {
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
    message: schema.string({ trim: true }, getMessageRules()),
    userId: schema.number(getUserIdRules('exists')),
    roomId: schema.number(getRoomIdRules('exists')),
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
