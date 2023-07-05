import { v4 } from "uuid";
import { IShip } from "../interfaces";
import { Player } from "./Player";

export class Game {
  idGame: string;
  // idPlayer: string;
  // ships: IShip[];

  constructor() {
    this.idGame = v4();
    // this.idPlayer = player.id;
    // this.ships = [];
  }
}