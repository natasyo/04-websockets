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
    const dataRequest = this.service.joinGame(ws, game)
    if (dataRequest && dataRequest.player && dataRequest.game) {
      const { game, player } = dataRequest
      const gameJoined: RequestResponse<GameJoined> = {
        type: 'game_joined',
        data: {
          gameId: game.id,
        },
        id: 0,
      }
      ws.send(JSON.stringify(gameJoined))
      const playerJoin: PlayerJoinedData = {
        playerName: player.name,
        playerCount: game.players.length,
      }
      const playersResponse: RequestResponse<PlayerJoinedData> = {
        type: 'player_joined',
        data: playerJoin,
        id: 0,
      }
      const updatePlayersResponse: RequestResponse<Player[]> = {
        type: 'player_joined',
        data: game?.players,
        id: 0,
      }
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(playersResponse))
        client.send(JSON.stringify(updatePlayersResponse))
      })
    }
  }

  start(
    wss: Server<typeof WebSocket, typeof IncomingMessage>,
    ws: WebSocket,
    { gameId }: { gameId: string }
  ) {
    const data = this.service.startGame(gameId)
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
  }
  answer( wss: Server<typeof WebSocket, typeof IncomingMessage>,
    ws: WebSocket,
    answer: Answer){
this.service.answer(answer)
  }
}
