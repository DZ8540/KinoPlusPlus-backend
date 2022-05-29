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

    Route.post('/newest/:currentUserId?', 'Api/Video/VideosController.getNewest')
    Route.post('/popular/:currentUserId?', 'Api/Video/VideosController.getPopular')
    Route.post('/search/:currentUserId?', 'Api/Video/VideosController.search')

    Route.group(() => {

      Route.post('/', 'Api/User/WishlistsController.add')
      Route.delete('/', 'Api/User/WishlistsController.delete')

    }).prefix('/wishlist').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/', 'Api/User/LaterListsController.add')
      Route.delete('/', 'Api/User/LaterListsController.delete')

    }).prefix('/laterList').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/:videoId', 'Api/Video/VideosCommentsController.paginate')

      Route.post('/', 'Api/Video/VideosCommentsController.create').middleware('CheckAccessToken')
      Route.patch('/:id', 'Api/Video/VideosCommentsController.update').middleware('CheckAccessToken')
      Route.delete('/:id', 'Api/Video/VideosCommentsController.delete').middleware('CheckAccessToken')

    }).prefix('/comments')

    Route.post('/:slug/:currentUserId?', 'Api/Video/VideosController.get')

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
    Route.post('/laterList/:id', 'Api/User/LaterListsController.getUserLaterList')
    Route.post('/historyList/:id', 'Api/User/HistoryListsController.getUserHistoryList')
    Route.patch('/:id', 'Api/User/UsersController.update')

  }).prefix('/user').middleware('CheckAccessToken')

  /**
   * * Room
   */

  // Route.group(() => {

  //   Route.post('/:videoName', 'Api/Room/RoomsController.search')

  // }).prefix('/rooms').middleware('CheckAccessToken')

}).prefix('/api')
