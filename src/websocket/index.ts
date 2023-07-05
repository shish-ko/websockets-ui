import { IFrame, IRoom } from "../interfaces";
import { Game } from "./Game";
import { Player } from "./Player";

const connections = new Set();
const rooms: IRoom[] = [];

export const connectionHandler = (ws: WebSocket) => {
  connections.add(ws);

  let player: Player;
  let game: Game;

  ws.onmessage = (msg: {data: string}) => {
    console.log(msg.data)
    const frame = JSON.parse(msg.data) as IFrame;
    const frameType = frame.type;
    
    if (frameType === 'reg') {
      const frameData = JSON.parse(frame.data);
      player = new Player(frameData.name, frameData.password)
      const res = JSON.stringify({
        type: "reg",
        data: JSON.stringify(player.getInfo()),
        id: 0,
      });
      ws.send(res);
      if(rooms.length) {
        const res2 = JSON.stringify({
          type: "update_room",
          data: JSON.stringify(rooms),
  
          id: 0,
        });
        ws.send(res2);        
      }



    } else if (frameType === 'create_room') {
      game = new Game(player);
      const res = JSON.stringify({
        type: "create_game",
        data: JSON.stringify(game),
        id: 0,
      })
      ws.send(res);
    } else if(frameType === 'add_ships') {
      const frameData = JSON.parse(frame.data);
      game.ships = frameData.ships;
      rooms.push({
        roomId: game.idGame,
        roomUsers:
          [{
            name: player.name,
            index: player.id,
          }],
      })



      // const frameData = JSON.parse(frame.data);
      // const res = JSON.stringify({
      //   type: "start_game",
      //   data: JSON.stringify(
      //       {
      //         ships: frameData.ships,
      //         currentPlayerIndex: player.id,
      //       }
      //     ),

      //   id: 0,
      // })
      // ws.send(res)
    } else if (frameType === '')

  }
}