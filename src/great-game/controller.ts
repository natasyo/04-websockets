import type {CreateGameRequest, Game, RequestResponse} from "../types/index.js";
import type {GameService} from "./service.js";
import { WebSocket} from "ws";
export class GameController{
    constructor(private readonly service:GameService){}
    create(ws:WebSocket,game:RequestResponse<CreateGameRequest>){
        console.log((game))
        this.service.createGame(game.data)
    }
}