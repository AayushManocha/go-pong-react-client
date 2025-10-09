import { produce } from "immer";
import { useEffect, useRef } from "react";
import { movePlayer } from "~/utils/api";
import type { Game, Player } from "~/utils/types";
import { getPlayerIndex } from "./usePlayerIndex";

type UseGameControlProps = {
  gameId: string;
  setGameState: React.Dispatch<React.SetStateAction<Game | null | undefined>>;
};

type Direction = "UP" | "DOWN";

export default function useGameControls({
  gameId,
  setGameState,
}: UseGameControlProps) {
  const serverLastNotifiedAt = useRef<number>(performance.now());

  const lastMovedAt = useRef<number | null>(null);
  const animationFrameIds = useRef<number[]>([]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        animatePaddle("UP");
      } else if (e.key === "ArrowDown") {
        animatePaddle("DOWN");
      }
    });

    document.addEventListener("keyup", () => {
      stopAnimation();
    });
  }, []);

  const animatePaddle = (direction: Direction) => {
    if (!lastMovedAt.current) {
      lastMovedAt.current = performance.now();
      return;
    }

    const deltaT = performance.now() - lastMovedAt.current;
    lastMovedAt.current = performance.now();

    const paddleVelocity = direction === "DOWN" ? 1 : -1;
    movePaddle(paddleVelocity * deltaT);
    const id = requestAnimationFrame(() => animatePaddle(direction));

    animationFrameIds.current.push(id);
  };

  const stopAnimation = () => {
    lastMovedAt.current = null;
    animationFrameIds.current.forEach((id) => cancelAnimationFrame(id));
  };

  const movePaddle = (px: number) => {
    setGameState((gameState) => {
      return produce(gameState, (draft) => {
        if (!draft || !gameState) return draft;

        const currentPlayerIndex = getPlayerIndex(gameId);

        const player = draft.players.find(
          (p) => p.index === parseInt(currentPlayerIndex || "-1"),
        );

        if (!player) return draft;

        const bottomPos = gameState?.canvasHeight - player.shape.height;
        const topPos = 0;

        const newY = player.shape.y + px;
        if (newY < bottomPos && newY > topPos) {
          player.shape.y += px;
          updateServerPaddlePosition(player);
        }
      });
    });
  };

  const updateServerPaddlePosition = (player: Player) => {
    if (performance.now() - serverLastNotifiedAt.current > 10) {
      movePlayer(gameId, player.shape.y);
      serverLastNotifiedAt.current = performance.now();
    }
  };
}
