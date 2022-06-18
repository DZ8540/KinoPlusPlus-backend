import { TablesNames } from 'Config/database'
import { Rule, rules } from '@ioc:Adonis/Core/Validator'

export function getRoomIdRules(uniqueOrExists: boolean | 'unique' | 'exists' = false, table: string = TablesNames.ROOMS): Rule[] {
  const idRules: Rule[] = [ rules.unsigned() ]

  if (uniqueOrExists == 'unique')
    idRules.push(rules.unique({ table, column: 'id' }))
  else if (uniqueOrExists == 'exists')
    idRules.push(rules.exists({ table, column: 'id' }))

  return idRules
}
