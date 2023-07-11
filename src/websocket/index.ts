import { IAttack, IFrame, IRoom } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";
import { frameHandler } from "./utils";

const games: Game[] = []
const connections = new Set<Player>();
const availableRooms = new AvailableRooms(connections);


export const connectionHandler = (ws: WebSocket) => {
  let player: Player;
  let game: Game;

  ws.onmessage = (msg: { data: string }) => {
    // console.log(msg.data)
    const frame = JSON.parse(msg.data) as IFrame;
    const frameType = frame.type;

    if (frameType === 'reg') {
      const frameData = JSON.parse(frame.data);
      player = new Player(frameData.name, frameData.password, ws);
      connections.add(player);
      ws.send(frameHandler('reg', player.getInfo()));
        ws.send(frameHandler("update_room", availableRooms));
        // TODO send winners table

    } else if (frameType === 'create_room') {
      availableRooms.create();
    } else if (frameType === 'add_ships') {
      const frameData = JSON.parse(frame.data);
      // const room = rooms.find((item) => item.roomId === frameData.gameId);
      // room?.addShips(player,frameData.ships);

    } else if (frameType === 'add_user_to_room') {
      const frameData = JSON.parse(frame.data);
      availableRooms.addPlayer(frameData.indexRoom, player);    
    } else if (frameType === 'attack') {
      const frameData = JSON.parse(frame.data) as IAttack;
      const game = games.find((game) => game.idGame === frameData.gameId);
      game?.attack(frameData);    
    } else if (frameType === 'randomAttack') {
      const frameData = JSON.parse(frame.data) as IAttack;
      const game = games.find((game) => game.idGame === frameData.gameId);
      game?.randomAttack();
    }
  }
  ws.onclose = () => {

  }
}