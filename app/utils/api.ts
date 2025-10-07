import axios from "axios";
import { getPlayerIndex } from "~/hooks/usePlayerIndex";

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

export const movePlayer = (gameId: string, newY: number) => {
  axios.post(`${SERVER_URL}/move-player`, {
    playerId: parseInt(getPlayerIndex(gameId) || "0"),
    gameId,
    newY,
  });
};
