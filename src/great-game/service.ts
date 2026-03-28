import { type GameData } from '../data/data-game.js'
import type {
  Answer,
  CreateGameRequestData,
  CreateGameResponseData,
  Game,
  JoinGameRequestData,
  QuestionBroadcast,
  QuestionResult,
  RequestResponse,
  PlayerResults,
  PlayerJoinedData,
  Player,
  QuestionsResultAnswer,
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
      throw new Error('You are not logged in')
    }
    const game = this.gameData.games.find((item) => item.code === data.code)
    if (!game) {
      throw new Error('game not found')
    }
    const player = this.gameData.players.find(
      (player) => player.index === ws.userId
    )
    if (!player) {
      throw new Error('player not found')
    }
    const isJoin = game.players.find((item) => item.index === player.index)
    if (isJoin) {
      throw new Error('player is joined')
    }
    game.players.push(player)
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
    return { player, game, playersResponse, updatePlayersResponse }
  }
  startGame(gameId: string) {
    const game = this.gameData.games.find((gameItem) => gameItem.id === gameId)
    if (game) {
      game.status = 'in_progress'
      return this.getQuestion(game?.id, 1)
    }
    return null
  }
  getQuestion(gameId: string, num: number) {
    const game = this.gameData.games.find((game) => game.id === gameId)
    if (game) {
      if (game.questions.length <= num) {
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
  answer(ws: WebSocket, answer: Answer) {
    const userId = ws.userId
    if (!userId) {
      throw new Error('Not auth')
    }
    const user = this.gameData.players.find((item) => item.index === ws.userId)

    const game = this.gameData.games.find((item) => item.id === answer.gameId)

    if (!game || !user) {
      throw new Error('Not found game')
    }
    const playerResults: PlayerResults = {
      answered: true,
      correct: false,
      name: user?.name,
      totalScore: game.questions.length,
      pointsEarned: 10,
    }
    const questionResult: QuestionResult = {
      questionIndex: answer.questionIndex,
      correctIndex: game.questions[answer.questionIndex]!.correctIndex,
      playerResults: [playerResults],
    }
    const questionResultAnswer: QuestionsResultAnswer = {
      gameId: game.id,
      questionResult: questionResult,
    }
    this.gameData.questionsResults.push(questionResultAnswer)
    return { questionResultAnswer }
  }
}
