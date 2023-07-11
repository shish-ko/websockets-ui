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
  private players: Player[]
  // private availableRooms: IRoom[];
  private isReady = 0

  constructor() {
    this.roomId = uuid();
    this.roomUsers = [];
    // this.availableRooms = availableRooms;
    this.players =[];
  }

  // createAvailableRoom() {
  //   this.availableRooms.add({
  //     roomId: this.roomId,
  //     roomUsers: []
  //   })
  // }

  addPlayer(player: Player) {
    this.players.push(player);
    this.roomUsers.push({name: player.name, index: player.id});
    if (this.roomUsers.length === 2) {
      this.createGame();
    }
    // this.availableRooms.addPlayer(this.roomId, player);
  }

  createGame() {
    this.players[0].ws.send(
      frameHandler("create_game", {
        idGame: this.roomId,
        idPlayer: this.players[1].id,
      })
    )
    this.players[1].ws.send(frameHandler("create_game", {
      idGame: this.roomId,
      idPlayer: this.players[0].id,
    }))
  }

  startGame() {
    // const game = new Game(this.roomId, this.allPlayers, this.roomUsers[0], this.roomUsers[1])
    // this.games.push(game);
  }

  addShips(player: Player, ships: IShip[]) {
    player.ships=ships
    this.isReady += 1;
    if (this.isReady === 2) {
      this.startGame()
    }
  }
}
