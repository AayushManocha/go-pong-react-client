import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const startGame = (gameId: string) => {
  if (!gameId) return;

  return axios.post(`${SERVER_URL}/game-start`, {
    gameId: gameId,
  });
};

export const pauseGame = (gameId: string) => {
  if (!gameId) return;

  return axios.post(`${SERVER_URL}/game-pause`, {
    gameId: gameId,
  });
};

export const movePlayer = (gameId: string, direction: string) => {
  axios.post(`${SERVER_URL}/move-player`, {
    playerId: parseInt(localStorage.getItem("PADDLE_BALL_PLAYER_INDEX") || "0"),
    gameId: gameId,
    direction,
  });
};
