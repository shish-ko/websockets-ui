import { IFrame } from "../interfaces";
import { RoomsController } from "./RoomsController";
import { Player } from "./Player";
import { Room } from "./Room";
import { dataParser, frameHandler, getWinners, PREDEFINED_MAP } from "./utils";

const connections = new Set<Player>();
const roomsController = new RoomsController(connections);

export const connectionHandler = (ws: WebSocket) => {
  let player: Player;
  let bot: Player;
  let room: Room;

  ws.onmessage = (msg: { data: string }) => {
    // console.log(msg.data)
    const frame = JSON.parse(msg.data) as IFrame;
    const { type: frameType, data } = frame;
    const frameData = dataParser(data);
    switch (frameType) {
      case 'reg':
        player = new Player(frameData.name, frameData.password, ws);
        player.validate(connections);
        ws.send(frameHandler('reg', player.getInfo()));
        if(!player.error){
          connections.add(player);
          ws.send(frameHandler("update_room", roomsController));
          ws.send(frameHandler('update_winners', getWinners(connections)));
        }
        break;
      case 'create_room':
        roomsController.create();
        break;
      case 'add_user_to_room':
        room = roomsController.addPlayer(frameData.indexRoom, player);
        break;
      case 'add_ships':
        room.addShips(player, frameData.ships);
        break;
      case 'attack':
        player.game?.attack(frameData);
        bot?.game?.botAttack(bot);
        break;
      case 'randomAttack':
        player.game?.randomAttack(player);
        break;
      case 'single_play':
        room = availableRooms.create();
        bot = new Player('Bot', 'pass', ws);
        availableRooms.addPlayer(room.roomId, bot);
        availableRooms.addPlayer(room.roomId, player);
        room.addShips(bot, PREDEFINED_MAP)
        break;
    }
  }
  ws.onclose = () => {
    if (player) {
      player.game?.surrender(player);
      connections.delete(player);
    }
  }

}

