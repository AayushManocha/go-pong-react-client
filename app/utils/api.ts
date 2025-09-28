import axios from "axios";

export const startGame = (gameId: string) => {
  if (!gameId) return;

  axios.post(`http://localhost:3000/game-start`, {
    gameId: parseInt(gameId),
  });
};

export const pauseGame = (gameId: string) => {
  if (!gameId) return;

  axios.post(`http://localhost:3000/game-pause`, {
    gameId: parseInt(gameId),
  });
};

export const movePlayer = (gameId: string, direction: string) => {
  axios.post("http://localhost:3000/move-player", {
    playerId: parseInt(localStorage.getItem("PADDLE_BALL_PLAYER_INDEX") || "0"),
    gameId: parseInt(gameId),
    direction,
  });
};
