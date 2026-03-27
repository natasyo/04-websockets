import { WebSocketServer, type WebSocket } from 'ws'
import { AccountController } from './account/controller.js'
import { AccountService } from './account/service.js'
import { GameData } from './data/data-game.js'
import { GameController } from './great-game/controller.js'
import { GameService } from './great-game/service.js'

const wss = new WebSocketServer({ port: 8080 })
const game = new GameData()
const accountService = new AccountService(game)
const accountController = new AccountController(accountService)
const gameService = new GameService(game)
const greatGame = new GameController(gameService)

wss.on('connection', (ws: WebSocket) => {
  ws.send('Server connected')
  ws.on('message', (data) => {
    const dataMessage = JSON.parse(data.toString())
    console.log('Received message', dataMessage)
    const type = dataMessage.type
    console.log('-------------------------Received type', type)
    switch (type) {
      case 'reg':
        accountController.addUser(ws, dataMessage.data)
        break
      case 'create_game':
        greatGame.create(ws, dataMessage.data)
        break
      case 'join_game':
        greatGame.join(wss, ws, dataMessage.data)
        break
      case 'start_game':
        greatGame.start(wss, ws, dataMessage.data)
        break
      case 'answer':
        greatGame.start(wss, ws, dataMessage.data)
        break
      default:
        console.log('Command not found')
        break
    }
    console.log(game)
  })

  ws.on('close', (code: any) => {
    console.log('connection disconnected', code)
  })
})
