import AdonisServer from '@ioc:Adonis/Core/Server'
import { Server } from 'socket.io'
import {
  ClientToServerEvents, ServerToClientEvents,
  InterServerEvents, SocketData,
} from 'Contracts/webSocket'

class WebSocket {
  public io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private booted = false

  public boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: '*'
      }
    })
  }
}

export default new WebSocket()
