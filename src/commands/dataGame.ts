import type { Player, User } from "../types/index.js";
export class DataGame {
  users: User[] = [];
  players: Player[] = [];
  addUser = (name:string, password:string) => {
    if (name && password && name !== "" && password !== "") {
      if(!this.users.find(user=>user.name===name)){
        this.users.push({ name, password });
      }      
    }
    console.log(this.users)
  };
}
