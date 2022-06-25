import Room from 'App/Models/Room/Room'
import Logger from '@ioc:Adonis/Core/Logger'
import WebSocket from 'App/Services/WebSocket'
import RoomMessage from 'App/Models/Room/RoomMessage'
import ResponseService from 'App/Services/ResponseService'
import RoomsController from 'App/Controllers/WebSocket/Api/Room/RoomsController'
import RoomsMessagesController from 'App/Controllers/WebSocket/Api/Room/RoomsMessagesController'
import { Err } from 'Contracts/services'
import { JoinRoomData } from 'Contracts/room'
import { ResponseCodes, ResponseMessages } from 'Config/response'

WebSocket.boot()

WebSocket.io.on('connection', (socket) => {
  connect()

  socket.on('room:create', async (request: any, cb: (result: Err | ResponseService) => void) => {
    const slug: Room['slug'] | void = await RoomsController.create(socket.data.userId!, request, cb)

    if (slug)
      socket.data.createdRoom = slug
  })

  socket.on('room:update', async (slug: Room['slug'], payload: any, cb: (result: Err | ResponseService) => void) => {
    if (socket.data.createdRoom != slug) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        msg: ResponseMessages.ERROR,
      })
    }

    const isOpen: void | Room['isOpen'] = await RoomsController.update(socket.data.userId!, slug, payload, cb)
    if (
      isOpen != null ||
      isOpen != undefined
    ) socket.to(slug).emit('room:update', isOpen)
  })

  socket.on('room:join', async (roomSlug: Room['slug'], cb: (result: Err | ResponseService) => void) => {
    const data: JoinRoomData = {
      roomSlug,
      userId: socket.data.userId!,
      isCreator: socket.data.createdRoom == roomSlug
    }
    const room: void | Room = await RoomsController.join(data, cb)

    if (room) {
      socket.data.room = roomSlug
      await socket.join(roomSlug)

      cb(new ResponseService(ResponseMessages.SUCCESS, room))
      socket.to(roomSlug).emit('room:usersCountUpdate', room.usersCount!)
    }
  })

  socket.on('room:sendMessage', async (slug: Room['slug'], request: any, cb: (result: Err | ResponseService) => void) => {
    if (!socket.rooms.has(slug)) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        msg: ResponseMessages.ERROR,
      })
    }

    const msg: RoomMessage | void = await RoomsMessagesController.sendMessage(request, cb)

    if (msg)
      socket.to(slug).emit('room:newMessage', msg)
  })

  socket.on('room:getMessages', RoomsMessagesController.paginate)

  socket.on('room:unJoin', async (slug: Room['slug'], cb: (result: Err | ResponseService) => void) => {
    await socket.leave(slug)

    if (socket.data.createdRoom == slug) {
      await RoomsController.delete(slug)
      resetRoom()

      socket.to(slug).emit('room:delete')
      return cb(new ResponseService(ResponseMessages.SUCCESS))
    }

    if (socket.data.room) {
      const data: JoinRoomData = {
        userId: socket.data.userId!,
        roomSlug: socket.data.room,
        isCreator: false,
      }
      const room: Room | void = await RoomsController.unJoin(data, cb)

      if (room) {
        socket.to(slug).emit('room:usersCountUpdate', room.usersCount!)
        cb(new ResponseService(ResponseMessages.SUCCESS))
      }
    }
  })

  socket.on('disconnect', async () => {
    if (socket.data.createdRoom) {
      await RoomsController.delete(socket.data.createdRoom)

      socket.to(socket.data.createdRoom).emit('room:delete')
      return
    }

    if (socket.data.room) {
      const data: JoinRoomData = {
        userId: socket.data.userId!,
        roomSlug: socket.data.room,
        isCreator: false,
      }
      const room: Room | void = await RoomsController.disconnectUnJoin(data)

      if (room)
        socket.to(socket.data.room).emit('room:usersCountUpdate', room.usersCount!)
    }
  })

  function resetRoom(): void {
    socket.data.createdRoom = null
    socket.data.room = null
  }

  function connect(): void {
    const userId: any = socket.handshake.query.userId

    if (!userId) {
      Logger.error(ResponseMessages.SOCKET_USER_ID_UNDEFINED)
      socket.disconnect()
      return
    }

    socket.data.userId = Number(userId)
  }

})
