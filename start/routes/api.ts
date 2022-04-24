import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')
    Route.post('/emailVerify/:token', 'Api/AuthController.emailVerify')

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')
    Route.post('/refreshToken', 'Api/AuthController.refreshToken').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])
    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

  }).prefix('/auth')

  /**
   * * Video
   */

  Route.group(() => {

    Route.post('/newest/', 'Api/VideosController.getNewest')
    Route.post('/popular/', 'Api/VideosController.getPopular')
    Route.post('/search', 'Api/VideosController.search')
    Route.post('/:slug', 'Api/VideosController.get')

  }).prefix('/videos')

  /**
   * * Genre
   */

  Route.group(() => {

    Route.post('/', 'Api/GenresController.getAll')
    Route.post('/showOnMainPage', 'Api/GenresController.showOnMainPage')
    Route.post('/:slug', 'Api/GenresController.get')

  }).prefix('/genres')

  /**
   * * User
   */

  Route.group(() => {

    Route.group(() => {

      Route.post('/', 'Api/User/WishlistsController.add')
      Route.delete('/', 'Api/User/WishlistsController.delete')

      Route.post('/:id', 'Api/User/WishlistsController.getUserWishlist')

    }).prefix('/wishlist')

    Route.patch('/:id', 'Api/User/UsersController.update')

  }).prefix('/user')

}).prefix('/api')
