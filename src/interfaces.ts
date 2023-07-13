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

export interface IBotFrameHandler {send: (data: string) => void}
export type IDescriptor = { isEmpty: false; left: number; shootDeadCells: number[]; shipCells: Array<[number, number]>; aroundCells: Array<[number, number]>} | {isEmpty: true, isShotted: boolean} 
const w = new Array(10).map((i) => {return {w:3}})