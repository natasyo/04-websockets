export interface Player {
  name: string
  index: number | string // unique player id
  score: number
}

export interface Question {
  text: string
  options: string[] // exactly 4 options
  correctIndex: number // index of the correct option (0-3)
  timeLimitSec: number // time limit for the question in seconds
}

export interface Game {
  id: string
  code: string // 6-character alphanumeric code
  hostId: number | string
  questions: Question[]
  players: Player[]
  currentQuestion: number // index of current question (-1 before start)
  status: 'waiting' | 'in_progress' | 'finished'
}

export interface User {
  name: string
  password: string
}

export interface RequestResponse<T> {
  type: string
  data: T
  id: number
}

export interface RegAnswer {
  name: string
  index: number | string
  error: boolean
  errorText: string
}

export interface CreateGameRequestData {
  questions: Question[]
}
export interface CreateGameResponseData {
  gameId: string
  code: string
}

export interface JoinGameRequestData {
  code: string
}

export interface PlayerJoinedData {
  playerName: string
  playerCount: number
}

export interface GameJoined {
  gameId: string
}

export interface QuestionBroadcast {
  questionNumber: number
  totalQuestions: number
  text: string
  options: string[]
  timeLimitSec: number
}

export interface Answer {
  gameId: string
  questionIndex: number
  answerIndex: number
}

export interface PlayerResults {
  name: string
  answered: boolean
  correct: boolean
  pointsEarned: number
  totalScore: number
}

export interface QuestionResult {
  questionIndex: number
  correctIndex: number
  playerResults: PlayerResults[]
}

export interface QuestionsResultAnswer {
  gameId: string
  questionResult: QuestionResult
}

export interface AnswerAccepted {
 questionIndex: number
}
