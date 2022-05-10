import Video from 'App/Models/Video/Video'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { VIDEOS_DESCRIPTION_LENGTH } from 'Config/database'

export function getVideoIdRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getVideoSlugRules(currentId?: Video['id'] | null, table: string = 'videos'): Rule[] {
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
