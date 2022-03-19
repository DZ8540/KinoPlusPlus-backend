declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    containNumber(): Rule,
    containUppercase(): Rule,
  }
}
