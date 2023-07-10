import { v4 } from "uuid";
import { IAttack, IDescriptor, IShip } from "../interfaces";
import { Player } from "./Player";
import { frameHandler } from "./utils";

export class Game {
  idGame: string;
  players: Player[];
  #currentPlayer: string;

  constructor(idGame: string, ...players: Player[]) {
    this.idGame = idGame;
    this.players = players;
    this.#currentPlayer = players[0].id
    players.forEach((player) => player.field = createField(player.ships!));
    players.forEach((player) => player.ws.send(frameHandler('start_game', { ships: player.ships, currentPlayerIndex: players[0].id })));
  }

  attack(data: IAttack) {
    console.log(data)
    console.log(this.#currentPlayer)
    const { indexPlayer, x, y } = data;
    if (indexPlayer === this.#currentPlayer) {
      const player = this.players.find((player) => player.id === indexPlayer) as Player;
      const cell = player.field![y][x];
      if (cell && !cell.shootDeadCells.includes(x + y)) {
        cell.shootDeadCells.push(x+y);
        cell.left -= 1;
        if (cell.left) {
          this.players.forEach((player) => player.ws.send(frameHandler('attack', {
            position:
            {
              x: x,
              y: y,
            },
            currentPlayer: this.#currentPlayer,
            status: "shot",
          })));
        } else {
          cell.shipCells.forEach((coordinate) => this.players.forEach((player)=> player.ws.send(frameHandler('attack', {
            position:
            {
              x: coordinate[0],
              y: coordinate[1],
            },
            currentPlayer: this.#currentPlayer,
            status: "killed",
          }))))
        }
      } else {
        this.players.forEach((player) => player.ws.send(frameHandler('attack', {
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: this.#currentPlayer,
          status: "missed",
        })));
        this.changePlayer();
      }

    }
    

  }
  changePlayer () {
    this.#currentPlayer = this.players.reduce((acc, item) => acc = item.id !==this.#currentPlayer ? item.id : acc, '' )
    this.players.forEach((item) => item.ws.send(frameHandler('turn', {currentPlayer: this.#currentPlayer})))
  }
}


function createField(ships: IShip[]) {
  const field: IDescriptor[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  ships.forEach((item) => {
    const descriptor: IDescriptor = {
      left: item.length,
      shootDeadCells: [],
      shipCells: [],
      arroundCells: [],
    }
    if (item.direction) {
      for (let i = item.position.y; i < item.position.y + item.length; i++) {
        field[i][item.position.x] = descriptor;
        descriptor.shipCells.push([item.position.x, i]);
        // TODO add arround cells
      }
    } else {
      for (let i = item.position.x; i < item.position.x + item.length; i++) {
        field[item.position.y][i] = descriptor
        descriptor.shipCells.push([i, item.position.y])
      }
    }
  })
  return field;
}


