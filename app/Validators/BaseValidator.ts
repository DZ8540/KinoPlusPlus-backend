
export default class BaseValidator {
  protected messages = {
    unique: 'Value already taken!',
    required: '{{ field }} is required!',
    email: '{{ field }} must be email format!',
    minLength: 'The {{ field }} must have {{ options.minLength }} items!',
    maxLength: 'The {{ field }} must have maximum {{ options.maxLength }} items!',
    mobile: 'The {{ field }} must be a mobile phone number!',
    nullable: 'The {{ field }} is not must be a nullable',
  }
}
