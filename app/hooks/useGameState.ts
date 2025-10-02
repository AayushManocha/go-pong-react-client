import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import type { Game } from "~/utils/types";
import { startGame as apiStartGame, pauseGame } from "~/utils/api";

export default function useGameState(gameId: string) {
  const [gameState, setGameState] = useState<Game | null | undefined>();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const prevTimestamp = useRef<number>(null);
  const animationFrameId = useRef<number>(null);
  const [gameStatus, setGameStatus] = useState("PAUSED");

  // const timeRemaining = useRef(5000);

  const startGame = async () => {
    await apiStartGame(gameId);
    setGameStatus("PLAYED");
    animationFrameId.current = requestAnimationFrame(() => {
      animateGame(performance.now());
    });
  };

  const stopGame = async () => {
    setGameStatus("PAUSED");
    await pauseGame(gameId);
    cancelAnimationFrame(animationFrameId.current);
  };

  const animateGame = (t: number) => {
    if (prevTimestamp.current != null) {
      moveBall(t);
      detectBallCollision();
      const deltaT = t - prevTimestamp.current;
      // timeRemaining.current -= deltaT;
    }
    // if (timeRemaining.current <= 0) {
    //   return;
    // }

    prevTimestamp.current = t;
    animationFrameId.current = requestAnimationFrame((t) => {
      animateGame(t);
    });
  };

  const moveBall = (t: number) => {
    const deltaT = t - prevTimestamp.current;
    setGameState((prev) => {
      return produce(prev, (draft) => {
        if (!draft) return draft;
        draft.ball.Shape.x += draft?.ball.SpeedX * deltaT;
        draft.ball.Shape.y += draft?.ball.SpeedY * deltaT;
        // console.log(
        //   `deltaT: ${deltaT} new pos: ${draft.ball.Shape.x}, ${draft.ball.Shape.y}`,
        // );
      });
    });
  };

  const detectBallCollision = () => {
    if (!gameState) return;

    setGameState((prev) => {
      const ballHitTopWall = prev?.ball.Shape.y <= 0;
      const ballHitBottomWall =
        prev?.ball.Shape.y >= gameState.canvasHeight - prev?.ball.Shape.width;

      console.log("y: ", prev?.ball.Shape.y);

      if (ballHitBottomWall || ballHitTopWall) {
        console.log("HIT WALL");
        return produce(prev, (draft) => {
          if (!draft) return draft;
          draft.ball.SpeedY *= -1;
        });
      }

      return prev;
    });
  };

  useEffect(() => {
    const playerIndex = localStorage.getItem("PADDLE_BALL_PLAYER_INDEX");
    if (playerIndex) {
      setCurrentPlayerIndex(parseInt(playerIndex));
    }
    const WS_URL = playerIndex
      ? `${import.meta.env.VITE_SERVER_URL}/echo?gameId=${gameId}&playerIndex=${playerIndex}`
      : `${import.meta.env.VITE_SERVER_URL}/echo?gameId=${gameId}`;

    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const messageType = message.type;

      if (messageType === "GAME_START_MESSAGE") {
        animateGame(performance.now());
      }

      if (messageType === "BALL_CORRECTION_MESSAGE") {
        setGameState((prev) => {
          return produce(prev, (draft) => {
            if (!draft) return draft;
            draft.ball.Shape.x = message.X;
            draft.ball.Shape.y = message.Y;
            draft.ball.SpeedX = message.SpeedX;
            draft.ball.SpeedY = message.SpeedY;
          });
        });
      }

      if (messageType === "PLAYER_MOVE_MESSAGE") {
        setGameState((prev) => {
          const newX = message.x;
          const newY = message.y;
          const targetPlayer = message.playerIndex;
          const targetPlayerIndex = prev?.players.findIndex(
            (p) => p.index === targetPlayer,
          ) as number;

          const newGameState = JSON.parse(JSON.stringify(prev)) as Game;

          newGameState.players[targetPlayerIndex].shape.x = newX;
          newGameState.players[targetPlayerIndex].shape.y = newY;
          return newGameState;
        });
      }

      if (messageType === "PLAYER_MESSAGE") {
        const playerIndex = message.Player.index;
        localStorage.setItem("PADDLE_BALL_PLAYER_INDEX", playerIndex);
      } else if (messageType === "GAME_MESSAGE") {
        // console.log("received game message");
        setGameState(message.Game);
      }
    };
  }, []);

  return { gameState, currentPlayerIndex, startGame, stopGame, gameStatus };
}
