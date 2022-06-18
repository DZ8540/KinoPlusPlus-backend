import Genre from 'App/Models/Video/Genre'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'
import { GENRES_DESCRIPTION_LENGTH, TablesNames } from 'Config/database'

const TABLE: TablesNames = TablesNames.GENRES

export function getGenreIdRules(table: string = TABLE): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' }),
  ]
}

export function getGenreSlugRules(currentSlug?: Genre['slug'] | null, table: string = TABLE): Rule[] {
  currentSlug = currentSlug ?? null

  return [
    rules.minLength(2),
    rules.maxLength(255),
    rules.unique({ table, column: 'slug', whereNot: { slug: currentSlug } }),
  ]
}

export function getGenreNameRules(currentSlug?: Genre['slug'] | null, table: string = TABLE): Rule[] {
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
