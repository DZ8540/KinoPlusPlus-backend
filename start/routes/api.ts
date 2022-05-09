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

    Route.post('/newest/:currentUserId?', 'Api/VideosController.getNewest')
    Route.post('/popular/:currentUserId?', 'Api/VideosController.getPopular')
    Route.post('/search/:currentUserId?', 'Api/VideosController.search')

    Route.group(() => {

      Route.post('/', 'Api/User/WishlistsController.add')
      Route.delete('/', 'Api/User/WishlistsController.delete')

    }).prefix('/wishlist')

    Route.post('/:slug/:currentUserId?', 'Api/VideosController.get')

  }).prefix('/videos')

  /**
   * * Genre
   */

  Route.group(() => {

    Route.post('/', 'Api/GenresController.getAll')
    Route.post('/showOnMainPage', 'Api/GenresController.showOnMainPage')

    Route.post('/movies/:slug/:currentUserId?', 'Api/GenresController.genreMovies')

    Route.post('/:slug', 'Api/GenresController.get')

  }).prefix('/genres')

  /**
   * * User
   */

  Route.group(() => {

    Route.post('/wishlist/:id', 'Api/User/WishlistsController.getUserWishlist')
    Route.patch('/:id', 'Api/User/UsersController.update')

  }).prefix('/user')

}).prefix('/api')
