import BaseValidator from './BaseValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getApiLimitRules, getApiPageRules } from './Rules/apiRules'

export default class ApiValidator extends BaseValidator {
  protected preParsedSchema = {
    page: schema.number(getApiPageRules()),

    /**
     * * Optional schemes
     */

    limit: schema.number.optional(getApiLimitRules()),
    orderBy: schema.enum.optional(['asc', 'desc'] as const),
  }

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
  public schema = schema.create(this.preParsedSchema)

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
