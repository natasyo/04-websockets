import type {
  Answer,
  CreateGameRequestData,
  GameJoined,
  JoinGameRequestData,
  Player,
  PlayerJoinedData,
  QuestionBroadcast,
  RequestResponse,
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
    try {
      const dataRequest = this.service.joinGame(ws, game)
      if (dataRequest && dataRequest.player && dataRequest.game) {
        const { game, playersResponse, updatePlayersResponse } = dataRequest
        const gameJoined: RequestResponse<GameJoined> = {
          type: 'game_joined',
          data: {
            gameId: game.id,
          },
          id: 0,
        }
        ws.send(JSON.stringify(gameJoined))

        wss.clients.forEach((client) => {
          client.send(JSON.stringify(playersResponse))
          client.send(JSON.stringify(updatePlayersResponse))
        })
      }
    } catch (error) {
      ws.send(JSON.stringify({error:(error as Error).message}))
    }
  }

  start(
    wss: Server<typeof WebSocket, typeof IncomingMessage>,
    ws: WebSocket,
    { gameId }: { gameId: string }
  ) {
    try {
      const data = this.service.startGame(ws, gameId)
      if (data && typeof data === 'object') {
        const sendFirstQuestionData: RequestResponse<QuestionBroadcast> = {
          type: 'question',
          data,
          id: 0,
        }
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(sendFirstQuestionData))
        })
      }
    } catch (error) {
      ws.send(JSON.stringify({ error:(error as Error).message }))
    }
  }
  answer(
    wss: Server<typeof WebSocket, typeof IncomingMessage>,
    ws: WebSocket,
    answer: Answer
  ) {
    try {
      this.service.answer(ws, answer)
    } catch (error) {
      ws.send((error as Error).message)
    }
  }
}
