import { v4 } from "uuid";
import { Player } from "./Player";
import { IShip } from "../interfaces";

// export class Room {
//   roomId: string;
//   roomUsers: Player[];
//   allPlayers: Set<Player>;
//   rooms: Room[];
//   private isReady = 0

//   constructor(rooms: Room[], allPlayers: Set<Player>) {
//     this.roomId = v4();
//     this.roomUsers = [];
//     this.rooms = rooms;
//     this.allPlayers = allPlayers;
//     this.updateRooms();
//   }

//   addPlayer(player: Player) {
//     this.roomUsers.push(player);
//     if (this.roomUsers.length === 2) {
//       this.createGame();
//     }
//   }

//   updateRooms() {
//     console.log(this.rooms)
//     this.allPlayers.forEach((item) => item.ws.send(JSON.stringify({
//       type: "update_room",
//       data: JSON.stringify(this.rooms),  
//       id: 0,
//     })))
//   }

//   createGame() {
//     this.roomUsers[0].ws.send(JSON.stringify({
//       type: "create_game",
//       data: JSON.stringify({
//         idGame: this.roomId,
//         idPlayer: this.roomUsers[1].id,
//       }),
//       id: 0,
//     }))
//     this.roomUsers[1].ws.send(JSON.stringify({
//       type: "create_game",
//       data: JSON.stringify({
//         idGame: this.roomId,
//         idPlayer: this.roomUsers[0].id,
//       }),
//       id: 0,
//     }))
//   }

//   startGame() {
//     this.roomUsers.forEach((item) => {
//       const frame = JSON.stringify({

//       })
//       // item.ws.send()
//     })
//   }

//   addShips(player: Player, ships: IShip) {
//     const currentPlayer = this.roomUsers.find((item) => item === player);
//     if (currentPlayer) currentPlayer.ships = ships;
//     this.isReady += 1;
//     if (this.isReady === 2) {
//       this.startGame()
//     }
//   }
// }

export class Room {
  roomId: string;
  roomUsers: {name: string, index: string, ws: WebSocket}[];
  idGame: string;

  constructor() {
    this.roomId = v4();
    this.roomUsers = [];
    this.idGame = v4();
  }

  addUserToRoom(player: Player) {
    this.roomUsers.push({name: player.name, index: player.id, ws: player.ws})
    if(this.roomUsers.length === 2){
      
    }
  }


}