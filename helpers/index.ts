import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { string } from '@ioc:Adonis/Core/Helpers'

export function camelCase(val: string): string {
  val = new cyrillicToTranslit().transform(val)

  return string.camelCase(val)
}
