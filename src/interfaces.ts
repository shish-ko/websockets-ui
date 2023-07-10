export interface IFrame {
  type: string;
  data: string;
  id: number
}

export interface IShip {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: "small" | "medium" | "large" | "huge",
}

export interface IRoom {
  roomId: string,
  roomUsers:
  {
    name: string,
    index: string,
  }[],
}

export interface IAttack {
  gameId: string,
  x: number,
  y: number,
  indexPlayer: string,
}

export type IDescriptor = { left: number; shootDeadCells: number[]; shipCells: Array<[number, number]>; arroundCells: Array<[number, number]>} | 0 