import { IRoom } from "../interfaces";
import { Player } from "./Player";

export class AvailableRooms extends Array<IRoom>{
  #connections: Set<Player>;
  constructor(connections: Set<Player>){
    super();
    this.#connections = connections
  }
  private announcement() {
    console.log("avail room  " + this.length)
    this.#connections.forEach((item) => item.ws.send(JSON.stringify({
      type: "update_room",
      data: JSON.stringify(this),  
      id: 0,
    })))
  }
  add(room: IRoom){
    this.push(room);
    this.announcement()
  }
  addPlayer(id: string, player: Player){
    const room = this.find((room) => room.roomId === id)
    room?.roomUsers.push({name: player.name, index: player.id})
    if(room?.roomUsers.length === 2) {
      this.splice(this.indexOf(room), 1)
      console.log("LEFT " + this.length)
    }
    this.announcement();
  }
}
