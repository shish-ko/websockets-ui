import { IAttack, IDescriptor, IShip } from "../interfaces";
import { Player } from "./Player";
import { frameHandler, getWinners } from "./utils";

export class Game {
  idGame: string;
  players: Player[];
  allPlayers: Set<Player>;
  #currentPlayer: Player;
  #defender: Player;

  constructor(idGame: string, allPlayers: Set<Player>, ...players: Player[]) {
    this.idGame = idGame;
    this.players = players;
    this.allPlayers = allPlayers;
    this.#currentPlayer = players[1];
    this.#defender = players[0];
    players.forEach((player) => player.field = createField(player.ships!));
    players.forEach((player) => player.shipsLeft = 10);
    players.forEach((player) => player.ws.send(frameHandler('start_game', { ships: player.ships, currentPlayerIndex: player.id })));
    players.forEach((player) => player.ws.send(frameHandler('turn', { currentPlayer: this.#currentPlayer.id })));
  }

  attack(data: IAttack) {
    const { indexPlayer, x, y } = data;
    if (indexPlayer !== this.#currentPlayer.id) return;
    const cell = this.#defender.field![y][x];
    if (!cell.isEmpty) {
      if (!cell.shootDeadCells.includes(x + y)) {
        cell.shootDeadCells.push(x + y);
        cell.left -= 1;
        if (cell.left) {
          this.announcePlayers('attack', {
            position: { x, y, },
            currentPlayer: this.#currentPlayer.id,
            status: "shot",
          });
        } else {
          cell.shipCells.forEach((shipCell) => this.announcePlayers('attack', {
            position:
            {
              x: shipCell[0],
              y: shipCell[1],
            },
            currentPlayer: this.#currentPlayer.id,
            status: "killed",
          }));
          cell.aroundCells.forEach((aroundCell) => {
            const [x, y] = aroundCell;
            this.announcePlayers('attack', {
              position: { x, y },
              currentPlayer: this.#currentPlayer.id,
              status: "missed",
            });
            if (x >= 0 && x<10 && y >= 0 && y<10) {
              const fieldCell = this.#defender.field![y][x];
              if (fieldCell?.isEmpty) fieldCell.isShotted = true;
            }

          });
          this.#currentPlayer.shipsLeft-=1;
          this.checkWin(this.#currentPlayer);
        }
        this.changePlayer(false);
      }
    } else {
      cell.isShotted = true;
      this.announcePlayers('attack', {
        position: { x, y },
        currentPlayer: this.#currentPlayer.id,
        status: "missed",
      });
      this.changePlayer(true);
    }

  }

  randomAttack(player: Player) {
    yLoop: for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = this.#defender.field![y][x]
        if (cell.isEmpty && !cell.isShotted) {
          this.attack({ gameId: this.idGame, x, y, indexPlayer: player.id })
          break yLoop;
        }
        if (!cell.isEmpty && !cell.shootDeadCells.includes(x + y)) {
          this.attack({ gameId: this.idGame, x, y, indexPlayer: player.id })
          break yLoop;
        }
      }
    }
  }
  botAttack(bot: Player){
    if(bot.id !== this.#currentPlayer.id) return;
    for(let i =0; i< 5; i++) {
      this.randomAttack(bot);
    }
  }
  surrender(loser: Player) {
    const winner = this.players.find((player) => player !== loser) as Player;
    winner.shipsLeft=0;
    this.checkWin(winner);
  }
  
  private changePlayer(isNew: boolean) {
    if (isNew) {
      this.#defender = this.#currentPlayer;
      this.#currentPlayer = this.players.reduce((acc, item) => acc = item.id !== this.#defender.id ? item : acc)
    }
    this.announcePlayers('turn', { currentPlayer: this.#currentPlayer.id });
  }
  private checkWin(player: Player) {
    if (!player.shipsLeft) {
      player.wins += 1;
      this.announcePlayers('finish', { winPlayer: player.id, })
      this.allPlayers.forEach((player) => player.ws.send(frameHandler('update_winners', getWinners(this.allPlayers))))
      this.players.forEach((player) => player.game = undefined)
    }
  }
  private announcePlayers(type: string, data: {}) {
    this.players.forEach((player) => player.ws.send(frameHandler(type, data)))
  }

}


function createField(ships: IShip[]) {
  const field: IDescriptor[][] = new Array(10).fill(1).map(() => new Array(10).fill(1).map(() => { return { isEmpty: true, isShotted: false } }));

  ships.forEach((item) => {
    const descriptor: IDescriptor = {
      isEmpty: false,
      left: item.length,
      shootDeadCells: [],
      shipCells: [],
      aroundCells: [],
    }
    if (item.direction) {
      for (let i = item.position.y; i < item.position.y + item.length; i++) {
        field[i][item.position.x] = descriptor;
        descriptor.shipCells.push([item.position.x, i]);
        descriptor.aroundCells.push([item.position.x - 1, i], [item.position.x + 1, i])
        if (i === item.position.y) {
          descriptor.aroundCells.push([item.position.x - 1, i - 1], [item.position.x, i - 1], [item.position.x + 1, i - 1]);
        }
        if (i === item.position.y + item.length - 1) {
          descriptor.aroundCells.push([item.position.x - 1, i + 1], [item.position.x, i + 1], [item.position.x + 1, i + 1])
        }
      }
    } else {
      for (let i = item.position.x; i < item.position.x + item.length; i++) {
        field[item.position.y][i] = descriptor
        descriptor.shipCells.push([i, item.position.y]);
        descriptor.aroundCells.push([i, item.position.y - 1], [i, item.position.y + 1])
        if (i === item.position.x) {
          descriptor.aroundCells.push([i - 1, item.position.y - 1], [i - 1, item.position.y], [i - 1, item.position.y + 1]);
        }
        if (i === item.position.x + item.length - 1) {
          descriptor.aroundCells.push([i + 1, item.position.y - 1], [i + 1, item.position.y], [i + 1, item.position.y + 1]);
        }
      }
    }
  })
  return field;
}


