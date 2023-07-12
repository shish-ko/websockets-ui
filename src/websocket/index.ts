import { IAttack, IFrame, IRoom } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";
import { dataParser, frameHandler } from "./utils";

const games: Game[] = []
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
    if (frameType === 'reg') {
      // const frameData = JSON.parse(frame.data);
      player = new Player(frameData.name, frameData.password, ws);
      connections.add(player);
      ws.send(frameHandler('reg', player.getInfo()));
      ws.send(frameHandler("update_room", availableRooms));
      // TODO send winners table

    } else if (frameType === 'create_room') {
      availableRooms.create();
    } else if (frameType === 'add_user_to_room') {
      room = availableRooms.addPlayer(frameData.indexRoom, player);
    } else if (frameType === 'add_ships') {
      room.addShips(player,frameData.ships);
    }  else if (frameType === 'attack') {
      player.game?.attack(frameData);
    } else if (frameType === 'randomAttack') {
      player.game?.randomAttack();
    }
  }
  ws.onclose = () => {
    player.game?.surrender(player);
  }
}
