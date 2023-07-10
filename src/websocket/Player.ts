import {v4 as uuid} from 'uuid';
import { IDescriptor, IShip } from '../interfaces';

export class Player {
  name: string;
  password: string;
  shipsLeft: number;
  id: string;
  ws: WebSocket;
  isPlaying: boolean;
  wins: number;
  error: boolean;
  errorText: string;
  ships?: IShip[]; 
  field?: IDescriptor[][]; 

  constructor (name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.shipsLeft = 0;
    this.id = uuid();
    this.isPlaying = false;
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