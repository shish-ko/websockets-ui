import { IRoom } from "../interfaces";
import { Player } from "./Player";
import { Room } from "./Room";

export class AvailableRooms extends Array<IRoom>{
  #connections: Set<Player>;
  constructor(connections: Set<Player>){
    super();
    this.#connections = connections
  }
  private announcement() {
    this.#connections.forEach((item) => item.ws.send(JSON.stringify({
      type: "update_room",
      data: JSON.stringify(this),  
      id: 0,
    })))
  }
  create(){
    this.push(new Room());
    this.announcement()
  }
  addPlayer(id: string, player: Player){
    const room = this.find((room) => room.roomId === id)
    room?.roomUsers.push({name: player.name, index: player.id})
    if(room?.roomUsers.length === 2) {
      this.splice(this.indexOf(room), 1);
    }
    this.announcement();
  }
}
