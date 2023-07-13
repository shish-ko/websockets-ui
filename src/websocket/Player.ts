import {randomUUID as uuid} from 'node:crypto';
import { IBotFrameHandler, IDescriptor, IShip } from '../interfaces';
import { Game } from './Game';
import { Room } from './Room';


export class Player {
  name: string;
  password: string;
  shipsLeft: number;
  id: string;
  ws: WebSocket;
  wins: number;
  error: boolean;
  errorText: string;
  game?: Game;
  ships?: IShip[]; 
  field?: IDescriptor[][]; 
  room?: Room;

  constructor (name: string, password: string, ws: WebSocket ) {
    this.name = name;
    this.password = password;
    this.shipsLeft = 0;
    this.id = uuid();
    this.error = false;
    this.errorText = '';
    this.ws = ws;
    this.wins = 0;
  }
  getInfo() {
    return {
      name: this.name,
      index: this.id,
      error: this.error,
      errorText: this.errorText,
    }
  }

}