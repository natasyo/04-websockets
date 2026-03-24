import { type GameData } from '../data/data-game.js'
import type { CreateGameRequest } from '../types/index.js'

export class GameService {
  constructor(private readonly gameData: GameData) {}

  createGame(data: CreateGameRequest) {
    return this.gameData.questions
  }
}
