import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')
    Route.post('/emailVerify/:token', 'Api/AuthController.emailVerify')

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')
    Route.post('/refreshToken', 'Api/AuthController.refreshToken').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])
    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

  }).prefix('/auth')

  Route.group(() => {

    Route.post('/newest/', 'Api/VideosController.getNewest')
    Route.post('/popular/', 'Api/VideosController.getPopular')
    Route.post('/search', 'Api/VideosController.search')
    Route.post('/:slug', 'Api/VideosController.get')

  }).prefix('/videos')

  Route.group(() => {

    Route.post('/', 'Api/GenresController.getAll')
    Route.post('/showOnMainPage', 'Api/GenresController.showOnMainPage')
    Route.post('/:slug', 'Api/GenresController.get')

  }).prefix('/genres')

}).prefix('/api')
