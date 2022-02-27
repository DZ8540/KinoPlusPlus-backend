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

import Route from '@ioc:Adonis/Core/Route'

Route.on('/').redirect('index')

Route.group(() => {
  Route.get('/', 'MainController.index').as('index')

  Route.resource('/videos', 'VideosController')

  Route.get('/syncVideos', 'MainController.syncVideos').as('syncVideos.index')
  Route.post('/syncVideos', 'MainController.syncVideosAction').as('syncVideos.sync')
}).prefix('/admin')

// * Api
Route.group(() => {
  Route.group(() => {

    Route.post('/newest/', 'Api/VideosController.getNewest')
    Route.post('/popular/', 'Api/VideosController.getPopular')
    Route.post('/:slug', 'Api/VideosController.get')

  }).prefix('/videos')
}).prefix('/api')
// * Api
