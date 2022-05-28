import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { string } from '@ioc:Adonis/Core/Helpers'

export function camelCase(val: string): string {
  val = new cyrillicToTranslit().transform(val)

  return string.camelCase(val)
}

export function getToken(header: string): string {
  return header.split(' ')[1]
}

export function isObjectNotEmpty(obj: object | undefined | null): boolean {
  if (obj == null || obj == undefined)
    return false

  return Boolean(Object.keys(obj).length)
}
