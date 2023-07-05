import {v4 as uuid} from 'uuid';
import { IShip } from '../interfaces';

export class Player {
  name: string;
  password: string;
  wins: number;
  id: string;
  ws: WebSocket;
  isPlaying: boolean;
  error: boolean;
  errorText: string;
  ships?: IShip; 

  constructor (name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.wins = 0;
    this.id = uuid();
    this.isPlaying = false;
    this.error = false;
    this.errorText = '';
    this.ws = ws;
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