export type Game = {
  players: Player[];
  ball: Ball;
  gameStatus: string;
  canvasHeight: number;
  canvasWidth: number;
  winner: number;
};

export type Player = {
  index: number;
  shape: Rectangle;
};

export type Ball = {
  Shape: Rectangle;
  Speed: number;
};

export type Rectangle = {
  x: number;
  y: number;
  height: number;
  width: number;
};
