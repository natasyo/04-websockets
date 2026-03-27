import type { Game, Player, Question, User, QuestionsResultData } from '../types/index.js'

export class GameData {
  users: User[] = []
  players: Player[] = []
  questions: Question[] = []
  games: Game[] = []
  questionsResults:QuestionsResultData[]=[]

}
