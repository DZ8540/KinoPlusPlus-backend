import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm'

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public tableName(model: typeof BaseModel) {
    return string.pluralize(string.camelCase(model.name))
  }

  public columnName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName)
  }

  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName)
  }
}
