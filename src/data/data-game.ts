import type { Game, Player, Question, User } from '../types/index.js'

export class GameData {
  users: User[] = []
  players: Player[] = []
  questions: Question[] = []
  games: Game[] = []
}
