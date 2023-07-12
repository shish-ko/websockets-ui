import { IFrame } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Player } from "./Player";
import { Room } from "./Room";
import { dataParser, frameHandler, getWinners } from "./utils";

const connections = new Set<Player>();
const availableRooms = new AvailableRooms(connections);

export const connectionHandler = (ws: WebSocket) => {
  let player: Player;
  let room: Room;

  ws.onmessage = (msg: { data: string }) => {
    // console.log(msg.data)
    const frame = JSON.parse(msg.data) as IFrame;
    const {type: frameType, data} = frame;
    const frameData = dataParser(data);
    switch(frameType){
      case 'reg':
        player = new Player(frameData.name, frameData.password, ws);
        connections.add(player);
        ws.send(frameHandler('reg', player.getInfo()));
        ws.send(frameHandler("update_room", availableRooms));
        ws.send(frameHandler('update_winners', getWinners(connections)));
        break;
      case 'create_room':
        availableRooms.create();
        break;
      case 'add_user_to_room':
        room = availableRooms.addPlayer(frameData.indexRoom, player);
        break;
      case 'add_ships':
        room.addShips(player,frameData.ships);
        break;
      case 'attack':
        player.game?.attack(frameData);
        break;
      case 'randomAttack':
        player.game?.randomAttack();
        break;
    }
  }
  ws.onclose = () => {
    if(player){
      player.game?.surrender(player);
      connections.delete(player);
    }
  }

}
