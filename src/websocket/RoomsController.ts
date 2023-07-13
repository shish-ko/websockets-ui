import { Player } from "./Player";
import { Room } from "./Room";

export class RoomsController extends Array<Room>{
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
    const room=new Room(this.#connections)
    this.push(room);
    this.announcement()
    return room;
  }
  addPlayer(id: string, player: Player){
    const room = this.find((room) => room.roomId === id) as Room;
    room?.addPlayer(player);
    if(room?.roomUsers.length === 2) {
      this.splice(this.indexOf(room), 1);
    }
    this.announcement();
    return room;
  }
}
