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
  shape: { x: number; y: number; width: number };
};

export type Ball = {
  Shape: { x: number; y: number; width: number };
  Speed: number;
};
