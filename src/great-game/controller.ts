import type { CreateGameRequest, RequestResponse } from '../types/index.js'
import type { GameService } from './service.js'
import { WebSocket } from 'ws'
export class GameController {
  constructor(private readonly service: GameService) {}
  create(ws: WebSocket, game: RequestResponse<CreateGameRequest>) {
    const data = this.service.createGame(game.data)
    ws.send(JSON.stringify(data))
  }
}
