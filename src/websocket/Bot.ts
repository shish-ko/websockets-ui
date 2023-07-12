import { WebSocket as WS } from "ws"
import { Player } from "./Player"
import { frameHandler } from "./utils";
import net from 'node:net'
export class Bot {
  // player: Player;

  constructor(){
    const ws = net.createConnection({ path: 'ws://localhost:8181/'}, () => {
      console.log(123)
    });
    ws.write('qwqwdqwd')
    // this.player.ws.send(frameHandler('reg', {name: 'Bot', password: '123123123'}))
  }

}

