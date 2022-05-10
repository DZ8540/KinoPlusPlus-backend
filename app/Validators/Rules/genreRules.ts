import Genre from 'App/Models/Video/Genre'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { GENRES_DESCRIPTION_LENGTH } from 'Config/database'
import { FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'

export function getGenreIdRules(table: string = 'genres'): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' }),
  ]
}

export function getGenreSlugRules(currentSlug?: Genre['slug'] | null, table: string = 'genres'): Rule[] {
  currentSlug = currentSlug ?? null

  return [
    rules.minLength(2),
    rules.maxLength(255),
    rules.unique({ table, column: 'slug', whereNot: { slug: currentSlug } }),
  ]
}

export function getGenreNameRules(currentSlug?: Genre['slug'] | null, table: string = 'genres'): Rule[] {
  currentSlug = currentSlug ?? null

  return [
    rules.minLength(2),
    rules.maxLength(255),
    rules.unique({ table, column: 'name', whereNot: { slug: currentSlug } }),
  ]
}

export function getGenreDescriptionRules(): Rule[] {
  return [
    rules.minLength(2),
    rules.maxLength(GENRES_DESCRIPTION_LENGTH),
  ]
}

export function getGenreImageOptions(): Partial<FileValidationOptions> {
  return {
    extnames: ['png', 'jpeg', 'jpg', 'webp'],
  }
}
