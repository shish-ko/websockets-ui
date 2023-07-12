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