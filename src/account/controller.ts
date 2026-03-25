import type { RegAnswer, RequestResponse, User } from '../types/index.js'
import type { AccountService } from './service.js'
import { WebSocket } from 'ws'

export class AccountController {
  constructor(private service: AccountService) {}

  addUser(ws: WebSocket, userData: User) {
    const { user, player } = this.service.addUser(userData)
    const answer: RequestResponse<RegAnswer> = {
      type: 'reg',
      data: {
        name: player!.name,
        index: player!.index,
        error: false,
        errorText: '',
      },
      id: 0,
    }
    if (player) {
      ws.userId = player.index
      ws.send(JSON.stringify(answer))
    } else ws.send('error')
  }
}
