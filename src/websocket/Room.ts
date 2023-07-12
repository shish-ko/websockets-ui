// import { v4 } from "uuid";
import {randomUUID as uuid} from 'node:crypto';
import { Player } from "./Player";
import { IRoom, IShip } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";
import { frameHandler } from "./utils";

export class Room {
  roomId: string;
  roomUsers: {
    name: string,
    index: string,
  }[];
  #players: Player[];
  // private availableRooms: IRoom[];
  #allPlayers: Set<Player>;
  #isReady = 0;

  constructor(allPlayers: Set<Player>) {
    this.roomId = uuid();
    this.roomUsers = [];
    // this.availableRooms = availableRooms;
    this.#players =[];
    this.#isReady = 0;
    this.#allPlayers = allPlayers;
  }

  // createAvailableRoom() {
  //   this.availableRooms.add({
  //     roomId: this.roomId,
  //     roomUsers: []
  //   })
  // }

  addPlayer(player: Player) {
    this.#players.push(player);
    this.roomUsers.push({name: player.name, index: player.id});
    if (this.roomUsers.length === 2) {
      this.createGame();
    }
    // this.availableRooms.addPlayer(this.roomId, player);
  }

  createGame() {
    this.#players[0].ws.send(
      frameHandler("create_game", {
        idGame: this.roomId,
        idPlayer: this.#players[1].id,
      })
    )
    this.#players[1].ws.send(frameHandler("create_game", {
      idGame: this.roomId,
      idPlayer: this.#players[0].id,
    }))
  }

  startGame() {
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
