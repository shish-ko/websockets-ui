import { v4 } from "uuid";
import { Player } from "./Player";
import { IRoom, IShip } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";

export class Room {
  roomId: string;
  roomUsers: Player[];
  allPlayers: Set<Player>;
  availableRooms: AvailableRooms;
  games: Game[];
  private isReady = 0

  constructor(availableRooms: AvailableRooms, allPlayers: Set<Player>, games: Game[]) {
    this.roomId = v4();
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
    console.log('USERS ' + this.roomUsers.length)
    if (this.roomUsers.length === 2) {
      this.createGame();
    }
    this.availableRooms.addPlayer(this.roomId, player);
  }

  createGame() {
    this.roomUsers[0].ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: this.roomId,
        idPlayer: this.roomUsers[1].id,
      }),
      id: 0,
    }))
    this.roomUsers[1].ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: this.roomId,
        idPlayer: this.roomUsers[0].id,
      }),
      id: 0,
    }))
  }

  startGame() {
    const game = new Game(this.roomId, this.roomUsers[0], this.roomUsers[1])
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

// export class Room {
//   roomId: string;
//   roomUsers: {name: string, index: string, ws: WebSocket}[];
//   idGame: string;

//   constructor() {
//     this.roomId = v4();
//     this.roomUsers = [];
//     this.idGame = v4();
//   }

//   addUserToRoom(player: Player) {
//     this.roomUsers.push({name: player.name, index: player.id, ws: player.ws})
//     if(this.roomUsers.length === 2){
      
//     }
//   }


// }