import type {
  CreateGameRequestData,
  JoinGameRequestData,
} from '../types/index.js'
import type { GameService } from './service.js'
import { type Server, WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
export class GameController {
  constructor(private readonly service: GameService) {}
  create(ws: WebSocket, game: CreateGameRequestData) {
    this.service.createGame(ws, game)
  }
  join(
    wss: Server<typeof WebSocket, typeof IncomingMessage>,
    ws: WebSocket,
    game: JoinGameRequestData
  ) {
    const player = this.service.joinGame(ws, game)
    if (player) {
      wss.clients.forEach((client) => {
        if (client.userId !== player.index) {
          client.send('user' + player.name + ' joined')
        }
      })
    }
  }
}
