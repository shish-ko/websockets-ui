import { IAttack, IDescriptor, IShip } from "../interfaces";
import { Player } from "./Player";
import { frameHandler } from "./utils";

export class Game {
  idGame: string;
  players: Player[];
  allPlayers: Set<Player>;
  #currentPlayer: string;

  constructor(idGame: string, allPlayers: Set<Player>, ...players: Player[]) {
    this.idGame = idGame;
    this.players = players;
    this.allPlayers = allPlayers;
    this.#currentPlayer = players[0].id
    players.forEach((player) => player.field = createField(player.ships!));
    players.forEach((player) => player.ws.send(frameHandler('start_game', { ships: player.ships, currentPlayerIndex: players[0].id })));
    players.forEach((player) => player.shipsLeft = 10);
  }

  attack(data: IAttack) {
    // console.log(data)
    // console.log(this.#currentPlayer)
    const { indexPlayer, x, y } = data;
    if (indexPlayer === this.#currentPlayer) {
      const player = this.players.find((player) => player.id === indexPlayer) as Player;
      const cell = player.field![y][x];
      if (cell && !cell.shootDeadCells.includes(x + y)) {
        cell.shootDeadCells.push(x+y);
        cell.left -= 1;
        if (cell.left) {
          this.announcePlayers('attack', {
            position:
            {
              x: x,
              y: y,
            },
            currentPlayer: this.#currentPlayer,
            status: "shot",
          });
        } else {
          cell.shipCells.forEach((coordinate) => this.announcePlayers('attack', {
            position:
            {
              x: coordinate[0],
              y: coordinate[1],
            },
            currentPlayer: this.#currentPlayer,
            status: "killed",
          }));
          cell.aroundCells.forEach((aroundCell)=> this.announcePlayers('attack', {
            position:
            {
              x: aroundCell[0],
              y: aroundCell[1],
            },
            currentPlayer: this.#currentPlayer,
            status: "missed",
          }));
          this.checkWin(player);
        }
      } else {
        this.announcePlayers('attack', {
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: this.#currentPlayer,
          status: "missed",
        });
        this.changePlayer();
      }
    } 
    
  }

  private changePlayer () {
    this.#currentPlayer = this.players.reduce((acc, item) => acc = item.id !==this.#currentPlayer ? item.id : acc, '' )
    this.announcePlayers('turn', {currentPlayer: this.#currentPlayer});
  }
  private checkWin(player: Player){
    player.shipsLeft-=1;
    if (!player.shipsLeft) {
      player.wins +=1;
      this.announcePlayers('finish',  {winPlayer: this.#currentPlayer,})
      this.allPlayers.forEach((player) => player.ws.send(frameHandler('update_winners',  this.players.map((player) => {return{name: player.name, wins: player.wins}}))))
    }
  }
  private announcePlayers(type: string, data: {}){
    this.players.forEach((player) => player.ws.send(frameHandler(type, data)))
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
      aroundCells: [],
    }
    if (item.direction) {
      for (let i = item.position.y; i < item.position.y + item.length; i++) {
        field[i][item.position.x] = descriptor;
        descriptor.shipCells.push([item.position.x, i]);
        descriptor.aroundCells.push([item.position.x-1, i], [item.position.x+1, i])
        if(i === item.position.y) {
          descriptor.aroundCells.push([item.position.x-1, i-1], [item.position.x, i-1], [item.position.x+1, i-1]);
        } 
        if(i === item.position.y + item.length-1) {
          descriptor.aroundCells.push([item.position.x-1, i+1], [item.position.x, i+1], [item.position.x+1, i+1])
        }
      }
    } else {
      for (let i = item.position.x; i < item.position.x + item.length; i++) {
        field[item.position.y][i] = descriptor
        descriptor.shipCells.push([i, item.position.y]);
        descriptor.aroundCells.push([i, item.position.y-1], [i, item.position.y+1])
        if(i === item.position.x) {
          descriptor.aroundCells.push([i-1, item.position.y-1], [i-1, item.position.y], [i-1, item.position.y+1]);
        }
        if(i === item.position.x + item.length-1){
           descriptor.aroundCells.push([i+1, item.position.y-1], [i+1, item.position.y], [i+1, item.position.y+1]);
        }
      }
    }
  })
  return field;
}


