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
  type: "small"|"medium"|"large"|"huge",
}

export interface IRoom {
  roomId: string,
  roomUsers:
    {
      name: string,
      index: string,
    }[],
}