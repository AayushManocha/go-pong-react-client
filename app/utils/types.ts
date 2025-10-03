export type Game = {
  players: Player[];
  ball: Ball;
  gameStatus: GameStatus;
  canvasHeight: number;
  canvasWidth: number;
  winner: number;
};

export type GameStatus =
  | "CREATED"
  | "READY"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "UNKNOWN";

export type Player = {
  index: number;
  shape: Rectangle;
};

export type Ball = {
  Shape: Rectangle;
  SpeedX: number;
  SpeedY: number;
};

export type Rectangle = {
  x: number;
  y: number;
  height: number;
  width: number;
};
