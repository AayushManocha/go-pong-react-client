export function getPlayerIndex(gameId: string) {
  const key = `PADDLE_BALL_${gameId}_PLAYER_INDEX`;
  return localStorage.getItem(key);
}

export function setPlayerIndex(gameId: string, value: string) {
  const key = `PADDLE_BALL_${gameId}_PLAYER_INDEX`;
  localStorage.setItem(key, value);
}
