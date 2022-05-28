import Room from 'App/models/Room/Room'
import WebSocket from 'App/Services/WebSocket'
import RoomMessage from 'App/models/Room/RoomMessage'
import ResponseService from 'App/Services/ResponseService'
import RoomsController from 'App/Controllers/Http/Api/Room/RoomsController'
import RoomsMessagesController from 'App/Controllers/Http/Api/Room/RoomsMessagesController'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'

WebSocket.boot()

WebSocket.io.on('connection', (socket) => {
  socket.data.rooms = []

  socket.on('room:paginate', RoomsController.paginate)

  socket.on('room:create', async (response: any, cb: (result: Error | ResponseService) => void) => {
    const slug: Room['slug'] | void = await RoomsController.create(response, cb)

    if (slug) {
      socket.data.rooms!.push(slug)
      socket.join(slug)
    }
  })

  socket.on('room:update', async (slug: Room['slug'], payload: any, cb: (result: Error | ResponseService) => void) => {
    if (!socket.data.rooms!.includes(slug)) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        msg: ResponseMessages.ERROR,
      })
    }

    const isOpen: void | Room['isOpen'] = await RoomsController.update(slug, payload, cb)
    if (isOpen)
      socket.emit('room:update', isOpen)
  })

  socket.on('room:join', async (slug: Room['slug'], request: any, cb: (result: Error | ResponseService) => void) => {
    const messages: void | ModelPaginatorContract<RoomMessage> = await RoomsController.join(slug, request, cb)

    if (messages) {
      socket.join(slug)
      cb(new ResponseService(ResponseMessages.SUCCESS, messages))
    }
  })

  socket.on('room:sendMessage', async (slug: Room['slug'], request: any, cb: (result: Error | ResponseService) => void) => {
    if (socket.rooms.has(slug)) {
      const msg: RoomMessage | void = await RoomsMessagesController.sendMessage(request, cb)

      if (msg)
        socket.broadcast.to(slug).emit('room:newMessage', msg)
    } else {
      cb({
        code: ResponseCodes.CLIENT_ERROR,
        msg: ResponseMessages.ERROR,
      })
    }
  })

  socket.on('room:unJoin', async (slug: Room['slug'], cb: (result: Error | ResponseService) => void) => {
    socket.leave(slug)

    if (socket.data.rooms!.includes(slug)) {
      await RoomsController.delete(slug)
      socket.data.rooms = socket.data.rooms!.filter((item: Room['slug']) => item != slug)
    }

    cb({
      code: ResponseCodes.CLIENT_ERROR,
      msg: ResponseMessages.ERROR,
    })
  })

  socket.on('disconnect', async () => {
    for (const item of socket.data.rooms!) {
      await RoomsController.delete(item)
    }
  })

})