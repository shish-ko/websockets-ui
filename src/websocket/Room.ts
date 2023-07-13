import {randomUUID as uuid} from 'node:crypto';
import { Player } from "./Player";
import { IShip } from "../interfaces";
import { Game } from "./Game";
import { frameHandler } from "./utils";

export class Room {
  roomId: string;
  roomUsers: {
    name: string,
    index: string,
  }[];
  #players: Player[];
  #allPlayers: Set<Player>;
  #isReady = 0;

  constructor(allPlayers: Set<Player>) {
    this.roomId = uuid();
    this.roomUsers = [];
    this.#players =[];
    this.#isReady = 0;
    this.#allPlayers = allPlayers;
  }

  addPlayer(player: Player) {
    this.#players.push(player);
    this.roomUsers.push({name: player.name, index: player.id});
    if (this.roomUsers.length === 2) {
      this.createGame();
    }
  }

  createGame() {
    this.#players.forEach((player) => player.ws.send(frameHandler("create_game", {
        idGame: this.roomId,
        idPlayer: player.id,
      }))
    )   
  }

  private startGame() {
    const game = new Game(this.roomId, this.#allPlayers, ...this.#players)
    this.#players.forEach((player) => player.game=game);
  }

  addShips(player: Player, ships: IShip[]) {
    player.ships=ships
    this.#isReady += 1;
    if (this.#isReady === 2) {
      this.startGame()
    }
  }
}
