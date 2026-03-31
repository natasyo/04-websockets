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
  AnswerAccepted,
} from '../types/index.js'
import { randomUUID } from 'node:crypto'
import { generateCode } from '../functions/generateCode.js'
import { WebSocket } from 'ws'
import { error } from 'node:console'

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
    ws.gameId = game.id
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
  startGame(ws: WebSocket, gameId: string) {
    const game = this.gameData.games.find((gameItem) => gameItem.id === gameId)
    if (!game) throw new Error('game not found')
    game.status = 'in_progress'

    return this.getQuestion(ws, game?.id, 1)
  }
  getQuestion(ws: WebSocket, gameId: string, num: number) {
    const game = this.gameData.games.find((game) => game.id === gameId)
    if (!game) throw new Error('game not found')

    if (game.questions.length <= num) throw new Error('Not found questions')

    const quest = game.questions[num - 1]

    const questData: QuestionBroadcast = {
      questionNumber: num,
      options: quest!.options,
      text: quest!.text,
      timeLimitSec: quest!.timeLimitSec,
      totalQuestions: game.questions.length,
    }
    ws.startTime = Date.now()
    return questData
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
    const points = ws.startTime ? (Date.now() - ws.startTime) / 1000 : 0
    let totalScore = 0
    const gameResults = this.gameData.questionsResults.find(
      (item) => item.gameId === game.id
    )
    const question = game.questions[answer.questionIndex]
    if (!question) {
      ws.send(JSON.stringify({ message: 'game over' }))
      return
    }
    let questionResult: QuestionResult | undefined =
      this.gameData.questionsResults.find(
        (item) => item.gameId === game.id
      )?.questionResult
    if (
      gameResults &&
      game.questions[answer.questionIndex] &&
      question.correctIndex === answer.answerIndex
    ) {
      const userResult = gameResults.questionResult.playerResults.find(
        (item) => item.name === user.name
      )
      if (userResult) totalScore = userResult.totalScore + points
      else totalScore = points
    }

    const playerResults: PlayerResults = {
      answered: true,
      correct: false,
      name: user?.name,
      totalScore: totalScore,
      pointsEarned: points,
    }
    if (questionResult) {
      questionResult.playerResults.push(playerResults)
    } else {
      questionResult = {
        questionIndex: answer.questionIndex,
        correctIndex: game.questions[answer.questionIndex]!.correctIndex,
        playerResults: [playerResults],
      }
    }

    const questionResultAnswer: QuestionsResultAnswer = {
      gameId: game.id,
      questionResult: questionResult,
    }
    this.gameData.questionsResults.push(questionResultAnswer)
    const response: RequestResponse<AnswerAccepted> = {
      type: 'answer_accepted',
      data: {
        questionIndex: answer.questionIndex,
      },
      id: 0,
    }
    ws.send(JSON.stringify(response))
    if (game.questions.length >= answer.questionIndex) {
      const newQuestion = this.getQuestion(
        ws,
        game.id,
        answer.questionIndex + 1
      )

      ws.send(JSON.stringify(newQuestion))
    }
  }
}
