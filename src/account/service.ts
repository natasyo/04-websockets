import { randomUUID } from "node:crypto";
import type { Player, User } from "../types/index.js";
export class AccountService {
  users: User[] = [];
  players: Player[] = [];
  addUser = (user: User) => {
    let player;
    if (
      user.name &&
      user.password &&
      user.name !== "" &&
      user.password !== ""
    ) {
      if (!this.users.find((item) => item.name === item.name)) {
        this.users.push(user);
        player = {
          name: user.name,
          index: randomUUID(),
          score: 0,
        };
      } else {
        player = this.players.find((item) => item.name === user.name);
      }
    }
    return {user,player};
  };
}
