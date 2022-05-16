import Video from 'App/Models/Video/Video'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { VIDEOS_DESCRIPTION_LENGTH } from 'Config/database'

const TABLE: string = 'videos'

export function getVideoIdRules(uniqueOrExists: boolean | 'unique' | 'exists' = false, table: string = TABLE): Rule[] {
  const idRules: Rule[] = [ rules.unsigned() ]

  if (uniqueOrExists == 'unique')
    idRules.push(rules.unique({ table, column: 'id' }))
  else if (uniqueOrExists == 'exists')
    idRules.push(rules.exists({ table, column: 'id' }))

  return idRules
}

export function getVideoSlugRules(currentId?: Video['id'] | null, table: string = TABLE): Rule[] {
  currentId = currentId ?? null

  return [
    rules.maxLength(50),
    rules.minLength(4),
    rules.unique({ table, column: 'slug', whereNot: { id: currentId } }),
  ]
}

export function getVideoNameRules(): Rule[] {
  return [
    rules.maxLength(20),
    rules.minLength(2),
  ]
}

export function getVideoDescriptionRules(): Rule[] {
  return [
    rules.maxLength(VIDEOS_DESCRIPTION_LENGTH),
    rules.minLength(2),
  ]
}

export function getVideoReleasedRules(): Rule[] {
  return [ rules.before('today') ]
}

export function getVideoRatingRules(): Rule[] {
  return [
    rules.range(0, 10),
    rules.unsigned(),
  ]
}

export function getVideoPosterRules(): Rule[] {
  return [
    rules.url(),
    rules.maxLength(255),
  ]
}

export function getVideoImageRules(): Rule[] {
  return [
    rules.url(),
    rules.maxLength(255),
  ]
}
