import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/login', 'AuthController.login').as('login')
  Route.post('/login', 'AuthController.loginAction').as('login.action')
  Route.get('/logout', 'AuthController.logout').as('logout')

}).prefix('/auth')
