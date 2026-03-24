import type { Player, Question, User } from '../types/index.js'
import fs from 'fs/promises'
import path = require('node:path')
export class GameData {
  users: User[] = []
  players: Player[] = []
  questions: Question[] = []
  constructor() {
    ;(async () => {
      this.questions = JSON.parse(
        await fs.readFile(path.join(process.cwd(), `./src/data/db.json`), {
          encoding: 'utf-8',
        })
      )
    })()
  }
}
