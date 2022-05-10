import { Rule, rules } from '@ioc:Adonis/Core/Validator'

export function getApiPageRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getApiLimitRules(): Rule[] {
  return [ rules.unsigned() ]
}
