import {v4 as uuid} from 'uuid';

export class Player {
  name: string;
  password: string;
  wins: number;
  id: string;
  isPlaying: boolean;
  error: boolean;
  errorText: string;

  constructor (name: string, password: string) {
    this.name = name;
    this.password = password;
    this.wins = 0;
    this.id = uuid();
    this.isPlaying = false;
    this.error = false;
    this.errorText = '';
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