import User from 'App/Models/User/User'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'

const TABLE: string = 'users'

export function getUserIdRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getUserNicknameRules(currentId?: User['id'] | null, table: string = TABLE): Rule[] {
  currentId = currentId ?? null

  return [
    rules.unique({ table, column: 'nickname', whereNot: { id: currentId } }),
    rules.maxLength(255),
    rules.minLength(3),
  ]
}

export function getUserEmailRules(currentId?: User['id'] | null, uniqueOrExists: boolean | 'unique' | 'exists' = false, table: string = TABLE): Rule[] {
  currentId = currentId ?? null
  const emailRules: Rule[] = [ rules.email() ]

  if (uniqueOrExists == 'unique')
    emailRules.push(rules.unique({ table, column: 'email', whereNot: { id: currentId } }))
  else if (uniqueOrExists == 'exists')
    emailRules.push(rules.exists({ table, column: 'email' }))

  return emailRules
}

export function getUserPhoneRules(): Rule[] {
  return [ rules.mobile() ]
}

export function getUserPasswordRules(withConfirm: boolean = false): Rule[] {
  const passwordRules: Rule[] = [
    rules.containNumber(),
    rules.containUppercase(),
    rules.minLength(8),
    rules.maxLength(30),
  ]

  if (withConfirm)
    passwordRules.push(rules.confirmed('passwordConfirm'))

  return passwordRules
}

export function getUserAvatarOptions(): Partial<FileValidationOptions> {
  return {
    size: '2mb',
    extnames: ['jpg', 'jpeg', 'png'],
  }
}
