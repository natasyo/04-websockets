import { randomUUID } from 'node:crypto'
import type { Player, User } from '../types/index.js'
import { GameData } from '../data/data-game.js'
export class AccountService {
  constructor(private readonly game: GameData) {}
  addUser = (user: User) => {
    let player

    if (
      user.name &&
      user.password &&
      user.name !== '' &&
      user.password !== ''
    ) {
      console.log(user)
      if (!this.game.users.find((item) => item.name === item.name)) {
        this.game.users.push(user)
        player = {
          name: user.name,
          index: randomUUID(),
          score: 0,
        }
      } else {
        player = this.game.players.find((item) => item.name === user.name)
      }
    }
    return { user, player }
  }
}
