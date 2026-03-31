import type {
  Game,
  Player,
  Question,
  User,
  QuestionsResultAnswer,
} from '../types/index.js'

export class GameData {
  users: User[] = []
  players: Player[] = []
  questions: Question[] = []
  games: Game[] = []
  questionsResults: QuestionsResultAnswer[] = []
}
