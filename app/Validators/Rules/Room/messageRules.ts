import { Rule, rules } from '@ioc:Adonis/Core/Validator'

export function getMessageRules(): Rule[] {
  return [
    rules.minLength(1),
    rules.maxLength(255),
  ]
}
