import Room from 'App/Models/Room/Room'
import WebSocket from 'App/Services/WebSocket'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ResponseService from 'App/Services/ResponseService'
import RoomsController from 'App/Controllers/Http/Api/Room/RoomsController'
import RoomsMessagesController from 'App/Controllers/Http/Api/Room/RoomsMessagesController'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type ReturnJoinRoomEventPayload = {
  usersCount: number,
  room: Room,
}

WebSocket.boot()

WebSocket.io.on('connection', (socket) => {
  socket.data.rooms = []

  async function getUsersCountInRoom(slug: Room['slug']): Promise<number> {
    return (await socket.in(slug).fetchSockets()).length
  }

  socket.on('room:paginate', RoomsController.paginate)

  socket.on('room:create', async (response: any, cb: (result: Error | ResponseService) => void) => {
    const slug: Room['slug'] | void = await RoomsController.create(response, cb)

    if (slug) {
      socket.data.rooms!.push(slug)
      await socket.join(slug)
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
    if (
      isOpen != null ||
      isOpen != undefined
    ) socket.to(slug).emit('room:update', isOpen)
  })

  socket.on('room:join', async (slug: Room['slug'], cb: (result: Error | ResponseService) => void) => {
    const room: void | Room = await RoomsController.join(slug, cb)

    if (room) {
      await socket.join(slug)

      const usersCount: number = await getUsersCountInRoom(slug)

      cb(new ResponseService(ResponseMessages.SUCCESS, { usersCount, room } as ReturnJoinRoomEventPayload))
      socket.to(slug).emit('room:usersCountUpdate', usersCount)
    }
  })

  socket.on('room:sendMessage', async (slug: Room['slug'], request: any, cb: (result: Error | ResponseService) => void) => {
    if (socket.rooms.has(slug)) {
      const msg: RoomMessage | void = await RoomsMessagesController.sendMessage(request, cb)

      if (msg)
        socket.to(slug).emit('room:newMessage', msg)
    } else {
      cb({
        code: ResponseCodes.CLIENT_ERROR,
        msg: ResponseMessages.ERROR,
      })
    }
  })

  socket.on('room:getMessages', RoomsMessagesController.paginate)

  socket.on('room:unJoin', async (slug: Room['slug'], cb: (result: Error | ResponseService) => void) => {
    await socket.leave(slug)

    if (socket.data.rooms!.includes(slug)) {
      await RoomsController.delete(slug)
      socket.data.rooms = socket.data.rooms!.filter((item: Room['slug']) => item != slug)

      socket.to(slug).emit('room:delete')
    } else {
      const usersCount: number = await getUsersCountInRoom(slug)
      socket.to(slug).emit('room:usersCountUpdate', usersCount)
    }

    cb(new ResponseService(ResponseMessages.SUCCESS))
  })

  socket.on('disconnect', async () => {
    for (const item of socket.data.rooms!) {
      await RoomsController.delete(item)

      socket.to(item).emit('room:delete')
    }
  })

})
