/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('containNumber', (val, _, options) => {
  if (typeof val !== 'string') {
    return
  }

  if (!(/\d/.test(val))) {
    options.errorReporter.report(
      options.pointer,
      'containNumber',
      'Field must have one numeric symbol!',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('containUppercase', (val, _, options) => {
  if (typeof val !== 'string') {
    return
  }

  if (!(/[A-Z]/g.test(val))) {
    options.errorReporter.report(
      options.pointer,
      'containUppercase',
      'Field must have one upper case letter!',
      options.arrayExpressionPointer
    )
  }
})
