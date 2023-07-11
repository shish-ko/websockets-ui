import { IAttack, IFrame, IRoom } from "../interfaces";
import { AvailableRooms } from "./AvailableRooms";
import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";

const games: Game[] = []
const connections = new Set<Player>();
const rooms: Room[] = [];
const availableRooms = new AvailableRooms(connections);


export const connectionHandler = (ws: WebSocket) => {
  let player: Player;
  
  ws.onmessage = (msg: { data: string }) => {
    // console.log(msg.data)
    const frame = JSON.parse(msg.data) as IFrame;
    const frameType = frame.type;

    if (frameType === 'reg') {
      const frameData = JSON.parse(frame.data);
      player = new Player(frameData.name, frameData.password, ws);
      connections.add(player);
      const res = JSON.stringify({
        type: "reg",
        data: JSON.stringify(player.getInfo()),
        id: 0,
      });
      ws.send(res);

      if (rooms.length) {
        const res2 = JSON.stringify({
          type: "update_room",
          data: JSON.stringify(availableRooms),
          id: 0,
        });
        ws.send(res2);
      }

    } else if (frameType === 'create_room') {
      const room = new Room(availableRooms, connections, games)
      rooms.push(room);
      room.createAvailableRoom()

    } else if (frameType === 'add_ships') {
      const frameData = JSON.parse(frame.data);
      const room = rooms.find((item) => item.roomId === frameData.gameId);
      room?.addShips(player,frameData.ships);

    } else if (frameType === 'add_user_to_room') {
      const frameData = JSON.parse(frame.data);
      const room = rooms.find((room) => room.roomId === frameData.indexRoom);
      room?.addPlayer(player);    
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
}