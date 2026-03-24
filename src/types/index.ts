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

export interface CreateGameRequest {
  questions: {
    text: string
    options: string
    correctIndex: number
    timeLimitSec: number
  }[]
}
export interface CreateGameResponse {
  gameId: string
  code: string
}
