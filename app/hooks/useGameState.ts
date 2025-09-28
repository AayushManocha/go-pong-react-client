import { useEffect, useState } from "react";
import type { Game } from "~/utils/types";

export default function useGameState(gameId: string) {
  const [gameState, setGameState] = useState<Game | null | undefined>();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    const playerIndex = localStorage.getItem("PADDLE_BALL_PLAYER_INDEX");
    if (playerIndex) {
      setCurrentPlayerIndex(parseInt(playerIndex));
    }
    const WS_URL = playerIndex
      ? `http://localhost:3000/echo?gameId=${gameId}&playerIndex=${playerIndex}`
      : `http://localhost:3000/echo?gameId=${gameId}`;

    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);
      const messageType = parsedData.Type;

      if (messageType === "PLAYER_MESSAGE") {
        const playerIndex = parsedData.Player.index;
        localStorage.setItem("PADDLE_BALL_PLAYER_INDEX", playerIndex);
      } else if (messageType === "GAME_MESSAGE") {
        setGameState(parsedData.Game);
      }
    };
  }, []);

  return { gameState, currentPlayerIndex };
}
