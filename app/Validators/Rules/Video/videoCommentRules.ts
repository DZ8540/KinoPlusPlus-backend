import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { VIDEO_COMMENTS_DESCRIPTION_LENGTH } from 'Config/database'

export function getVideoCommentDescriptionRules(): Rule[] {
  return [
    rules.maxLength(VIDEO_COMMENTS_DESCRIPTION_LENGTH),
    rules.minLength(2),
  ]
}
