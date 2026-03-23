import {type  GameData} from "../data/data-game.js";
import type {CreateGameRequest} from "../types/index.js";

export  class GameService {
    constructor(private readonly game:GameData) {
    }

    createGame(data:CreateGameRequest){
console.log(data);
    }

}