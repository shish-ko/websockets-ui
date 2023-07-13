import { IShip } from "../interfaces";
import { Player } from "./Player";

export const frameHandler = (type: string, data: {}) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  })
}

export function dataParser(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return 
  }
}

export function getWinners(set: Set<Player>) {
  const res = []
  for (let player of set.values()){
    player.wins && res.push({name: player.name, wins: player.wins})
  }
  return res;
}

export const PREDEFINED_MAP: IShip[] = [
  {
    position: { x: 1, y: 4 },
    direction: true,
    type: 'huge',
    length: 4
  },
  {
    position: { x: 1, y: 1 },
    direction: false,
    type: 'large',
    length: 3
  },
  {
    position: { x: 5, y: 2 },
    direction: false,
    type: 'large',
    length: 3
  },
  {
    position: { x: 7, y: 5 },
    direction: false,
    type: 'medium',
    length: 2
  },
  {
    position: { x: 7, y: 8 },
    direction: false,
    type: 'medium',
    length: 2
  },
  {
    position: { x: 3, y: 5 },
    direction: false,
    type: 'medium',
    length: 2
  },
  {
    position: { x: 9, y: 1 },
    direction: false,
    type: 'small',
    length: 1
  },
  {
    position: { x: 4, y: 8 },
    direction: true,
    type: 'small',
    length: 1
  },
  {
    position: { x: 7, y: 0 },
    direction: true,
    type: 'small',
    length: 1
  },
  {
    position: { x: 0, y: 9 },
    direction: true,
    type: 'small',
    length: 1
  }
]