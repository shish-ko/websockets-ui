import { IFrame, IRoom } from "../interfaces";
import { Game } from "./Game";
import { Player } from "./Player";

let game: Game;
const connections = new Set<Player>();
const rooms: IRoom[] = [];
setInterval(() => {
  const fullRoom = rooms.find((item) => item.roomUsers.length === 2);
  if(fullRoom) {
    const [{index : player1}, {index: player2}] = fullRoom.roomUsers;
    connections.forEach((item) => {if((item.id === player1) || (item.id === player2)){
      const res = JSON.stringify({
          type: "start_game",
          data: JSON.stringify(
              {
                ships: game.ships,
                currentPlayerIndex: player1,
              }
            ),
  
          id: 0,
        })
      item.ws.send(res);
      }});
      
      rooms.splice(rooms.indexOf(fullRoom), 1)
  }
}, 1000)

export const connectionHandler = (ws: WebSocket) => {
  // connections.add(ws);

  let player: Player;


  ws.onmessage = (msg: {data: string}) => {
    console.log(msg.data)
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
      const room = rooms.find((item) => item.roomId === frameData.gameId);
      if(room) {
        room.roomUsers.push({name: player.name, index: player.id})
      } else {
        rooms.push({
          roomId: game.idGame,
          roomUsers:
            [{
              name: player.name,
              index: player.id,
            }],
        })
      }



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
    } else if (frameType === 'add_user_to_room') {
      const frameData = JSON.parse(frame.data);
      game = new Game(player);
      const res = JSON.stringify({
        type: "create_game",
        data: JSON.stringify({
          idGame: frameData.indexRoom,
          idPlayer: player.id
        }),
        id: 0,
      });
      ws.send(res);
    }

  }
}