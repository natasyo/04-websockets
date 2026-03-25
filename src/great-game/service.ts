import { type GameData } from '../data/data-game.js'
import type {
  CreateGameRequestData,
  CreateGameResponseData,
  Game,
  JoinGameRequestData,
  RequestResponse,
} from '../types/index.js'
import { randomUUID } from 'node:crypto'
import { generateCode } from '../functions/generateCode.js'
import { WebSocket } from 'ws'

export class GameService {
  constructor(private readonly gameData: GameData) {}

  createGame(ws: WebSocket, data: CreateGameRequestData) {
    if (!ws.userId) {
      ws.send('is not authenticated')
      return
    }

    const game: Game = {
      id: randomUUID(),
      code: generateCode(6),
      questions: data.questions,
      players: [],
      status: 'waiting',
      currentQuestion: 1,
      hostId: ws.userId,
    }
    this.gameData.games.push(game)
    const response: RequestResponse<CreateGameResponseData> = {
      type: 'game_created',
      data: {
        gameId: game.id,
        code: game.code,
      },
      id: 0,
    }
    ws.send(JSON.stringify(response))
  }

  joinGame(ws: WebSocket, data: JoinGameRequestData) {
    if (!ws.userId) {
      ws.send('is not authenticated')
      return
    }
    const room = this.gameData.games.find((item) => item.code === data.code)
    const player = this.gameData.players.find(
      (player) => player.index === ws.userId
    )
    if (player) {
      this.gameData.players.push(player)
    }
    return player
  }
}
