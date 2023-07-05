import { v4 } from "uuid";
import { Player } from "./Player";
import { IShip } from "../interfaces";

export class Room {
  id: string;
  roomPlayers: Player[];
  allPlayers: Player[];
  private isReady = 0

  constructor(allPlayers: Player[]) {
    this.id = v4();
    this.roomPlayers = [];
    this.allPlayers = allPlayers;
  }

  addPlayer(player: Player) {
    this.roomPlayers.push(player);    
  }

  // createGame(){
  //   this.roomPlayers.forEach((item) => item.ws.send())
  // }
  // startGame(){
  //   this.roomPlayers.forEach((item) => {
  //     const frame = 
  //     item.ws.send()})
  // }

  addShips(player: Player, ships: IShip){
    const currentPlayer = this.roomPlayers.find((item) => item === player);
    if(currentPlayer) currentPlayer.ships=ships;
    this.isReady += 1;
    if (this.isReady === 2) {
      this.startGame()
    }
  }
}