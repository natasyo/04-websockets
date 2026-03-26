import { type GameData } from '../data/data-game.js'
import type {
  CreateGameRequestData,
  CreateGameResponseData,
  Game,
  JoinGameRequestData,
  QuestionBroadcast,
  RequestResponse,
} from '../types/index.js'
import { randomUUID } from 'node:crypto'
import { generateCode } from '../functions/generateCode.js'
import { WebSocket } from 'ws'

export class GameService {
  constructor(private readonly gameData: GameData) {}

  getPlayers() {
    return this.gameData.players
  }

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
      return null
    }
    const game = this.gameData.games.find((item) => item.code === data.code)
    const player = this.gameData.players.find(
      (player) => player.index === ws.userId
    )
    if (player) {
      game?.players.push(player)
    }
    return { player, game }
  }
  startGame(gameId: string) {
    const game = this.gameData.games.find((game) => game.id === gameId)
    if (game) {
      game.status = 'in_progress'
      return this.getQuestion(game?.id, 0)
    }
    return null
  }
  getQuestion(gameId: string, num: number) {
    const game = this.gameData.games.find((game) => game.id === gameId)
    if (game) {
      if (game.questions.length >= num) {
        return 'game over'
      }
      const quest = game.questions[num - 1]
      if (quest) {
        const questData: QuestionBroadcast = {
          questionNumber: num,
          options: quest!.options,
          text: quest.text,
          timeLimitSec: quest.timeLimitSec,
          totalQuestions: game.questions.length,
        }
        return questData
      }
    }
    return null
  }
}
