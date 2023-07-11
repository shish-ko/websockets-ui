// import { v4 } from "uuid";
import {randomUUID as uuid} from 'node:crypto';
import { Player } from "./Player";
import { IRoom, IShip } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";
import { frameHandler } from "./utils";

export class Room {
  roomId: string;
  roomUsers: Player[];
  allPlayers: Set<Player>;
  availableRooms: AvailableRooms;
  games: Game[];
  private isReady = 0

  constructor(availableRooms: AvailableRooms, allPlayers: Set<Player>, games: Game[]) {
    this.roomId = uuid();
    this.roomUsers = [];
    this.availableRooms = availableRooms;
    this.allPlayers = allPlayers;
    this.games = games;
  }

  createAvailableRoom() {
    this.availableRooms.add({
      roomId: this.roomId,
      roomUsers: []
    })
  }

  addPlayer(player: Player) {
    this.roomUsers.push(player);
    if (this.roomUsers.length === 2) {
      this.createGame();
    }
    this.availableRooms.addPlayer(this.roomId, player);
  }

  createGame() {
    this.roomUsers[0].ws.send(
      frameHandler("create_game", {
        idGame: this.roomId,
        idPlayer: this.roomUsers[1].id,
      })
    )
    this.roomUsers[1].ws.send(frameHandler("create_game", {
      idGame: this.roomId,
      idPlayer: this.roomUsers[0].id,
    }))
  }

  startGame() {
    const game = new Game(this.roomId, this.allPlayers, this.roomUsers[0], this.roomUsers[1])
    this.games.push(game);
  }

  addShips(player: Player, ships: IShip[]) {
    const currentPlayer = this.roomUsers.find((item) => item === player);
    if (currentPlayer) currentPlayer.ships = ships;
    this.isReady += 1;
    if (this.isReady === 2) {
      this.startGame()
    }
  }
}
