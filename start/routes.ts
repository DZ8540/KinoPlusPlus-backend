/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import './routes/api'
import Route from '@ioc:Adonis/Core/Route'

Route.on('/').redirect('index')

Route.group(() => {

  Route.get('/', 'MainController.index').as('index')

  Route.resource('/videos', 'VideosController')

  Route.resource('/genres', 'GenresController')

  Route.group(() => {

    Route.get('/', 'MainController.syncVideos').as('index')
    Route.post('/', 'MainController.syncVideosAction').as('sync')

  }).prefix('/syncVideos').as('syncVideos')

}).prefix('/admin')
