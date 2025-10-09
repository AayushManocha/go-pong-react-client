import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import {
  type GameStatus,
  type Game,
  type Player,
  type Ball,
} from "~/utils/types";
import { startGame as apiStartGame, pauseGame } from "~/utils/api";
import { getPlayerIndex, setPlayerIndex } from "./usePlayerIndex";
import useGameControls from "./useGameControls";

export default function useGameState(gameId: string) {
  const [gameState, setGameState] = useState<Game | null | undefined>();
  const prevTimestamp = useRef<number>(null);
  const animationFrameId = useRef<number[]>([]);
  useGameControls({ gameId, setGameState });

  const updateGameStatus = (newStatus: GameStatus) => {
    setGameState((gameState) => {
      return produce(gameState, (draft) => {
        if (!draft) return draft;
        draft.gameStatus = newStatus;
      });
    });
  };

  const updateGameWinner = (winner: number) => {
    setGameState((gameState) => {
      return produce(gameState, (draft) => {
        if (!draft) return draft;
        draft.winner = winner;
      });
    });
  };

  const startGame = async () => {
    await apiStartGame(gameId);
    updateGameStatus("IN_PLAY");
  };

  const stopGame = async () => {
    updateGameStatus("PAUSED");
    await pauseGame(gameId);
    animationFrameId.current.forEach((id) => {
      cancelAnimationFrame(id);
    });
  };

  const animateGame = (t: number) => {
    if (prevTimestamp.current != null) {
      moveBall(t);
      detectWallCollision();
      detectPaddleCollision();
    }

    prevTimestamp.current = t;
    animationFrameId.current.push(
      requestAnimationFrame((t) => {
        animateGame(t);
      }),
    );
  };

  const moveBall = (t: number) => {
    const deltaT = t - prevTimestamp.current;
    setGameState((prev) => {
      return produce(prev, (draft) => {
        if (!draft) return draft;
        draft.ball.Shape.x += draft?.ball.SpeedX * deltaT;
        draft.ball.Shape.y += draft?.ball.SpeedY * deltaT;
      });
    });
  };

  const detectWallCollision = () => {
    const HIT_TOLERANCE = 0;

    setGameState((prev) => {
      if (!prev) return prev;
      const ballHitTopWall = prev?.ball.Shape.y <= HIT_TOLERANCE;
      const ballHitBottomWall =
        prev?.ball.Shape.y >=
        prev.canvasHeight - prev?.ball.Shape.width + HIT_TOLERANCE;

      if (ballHitBottomWall) {
        return produce(prev, (draft) => {
          if (!draft) return draft;
          draft.ball.SpeedY = Math.abs(draft.ball.SpeedY) * -1;
        });
      }

      if (ballHitTopWall) {
        return produce(prev, (draft) => {
          if (!draft) return draft;
          draft.ball.SpeedY = Math.abs(draft.ball.SpeedY);
        });
      }
      return prev;
    });
  };

  const detectPaddleCollision = () => {
    setGameState((gameState) => {
      if (!gameState) return gameState;

      const ballX = gameState.ball.Shape.x;
      const ballY = gameState.ball.Shape.y;
      const ballWidth = gameState.ball.Shape.width;

      const leftPaddle = gameState.players.find((p) => p.index === 1) as Player;
      const leftPaddleX = leftPaddle.shape.x;
      const leftPaddleY = leftPaddle.shape.y;

      const rightPaddle = gameState.players.find(
        (p) => p.index === 2,
      ) as Player;
      const rightPaddleX = rightPaddle.shape.x;
      const rightPaddleY = rightPaddle.shape.y;

      const paddleHeight = leftPaddle.shape.height;
      const paddleWidth = leftPaddle.shape.width;

      const leftXHit = ballX <= leftPaddleX + paddleWidth;
      const leftYHit =
        ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight;

      const rightXHit = ballX >= rightPaddleX - paddleWidth;
      const rightYHit =
        ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight;

      const leftPaddleHit = leftXHit && leftYHit;
      const rightPaddleHit = rightXHit && rightYHit;

      if (leftPaddleHit) {
        console.log("left hit");
        return produce(gameState, (draft) => {
          draft.ball.SpeedX = Math.abs(draft.ball.SpeedX);
        });
      }

      if (rightPaddleHit) {
        console.log("right hit");
        return produce(gameState, (draft) => {
          draft.ball.SpeedX = Math.abs(draft.ball.SpeedX) * -1;
        });
      }

      return gameState;
    });
  };

  useEffect(() => {
    const playerIndex = getPlayerIndex(gameId);

    const WS_URL = playerIndex
      ? `${import.meta.env.VITE_SERVER_URL}/echo?gameId=${gameId}&playerIndex=${playerIndex}`
      : `${import.meta.env.VITE_SERVER_URL}/echo?gameId=${gameId}`;

    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const messageType = message.type;

      if (messageType === "GAME_START_MESSAGE") {
        updateGameStatus("IN_PLAY");
        animationFrameId.current.push(
          requestAnimationFrame(() => {
            animateGame(performance.now());
          }),
        );
      } else if (messageType === "GAME_STOP_MESSAGE") {
        updateGameStatus("PAUSED");
        prevTimestamp.current = null;
        animationFrameId.current.forEach((id) => {
          cancelAnimationFrame(id);
        });
      } else if (messageType === "GAME_WIN_MESSAGE") {
        updateGameStatus("FINISHED");
        updateGameWinner(message.playerIndex);
        animationFrameId.current.forEach((id) => {
          cancelAnimationFrame(id);
        });
      } else if (messageType === "BALL_CORRECTION_MESSAGE") {
        setGameState((prev) => {
          return produce(prev, (draft) => {
            if (!draft) return draft;

            draft.ball.Shape.x = message.X;
            draft.ball.Shape.y = message.Y;
            draft.ball.SpeedX = message.SpeedX;
            draft.ball.SpeedY = message.SpeedY;
          });
        });
      } else if (messageType === "PLAYER_MOVE_MESSAGE") {
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
      } else if (messageType === "PLAYER_JOINED_MESSAGE") {
        const playerIndex = message.Player.index;
        setPlayerIndex(gameId, playerIndex);
      } else if (messageType === "GAME_MESSAGE") {
        setGameState(message.Game);
      }
    };
  }, []);

  return { gameState, startGame, stopGame };
}
