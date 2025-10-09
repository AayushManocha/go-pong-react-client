import { useHotkeys } from "@mantine/hooks";
import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import { movePlayer } from "~/utils/api";
import type { Game, Player } from "~/utils/types";
import { getPlayerIndex } from "./usePlayerIndex";

type UseGameControlProps = {
  gameId: string;
  gameState: Game | null | undefined;
  setGameState: React.Dispatch<React.SetStateAction<Game | null | undefined>>;
};

type Direction = "UP" | "DOWN";

export default function useGameControls({
  gameId,
  gameState,
  setGameState,
}: UseGameControlProps) {
  const [movingDirection, setMovingDirection] = useState<Direction | null>(
    null,
  );

  const currentPlayerIndex = getPlayerIndex(gameId);
  const startedMovingAt = useRef<number | null>(null);
  const serverLastNotifiedAt = useRef<number>(-1);

  useEffect(() => {
    console.log("useGameControls");
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        setMovingDirection("UP");
        startedMovingAt.current = Date.now();
      } else if (e.key === "ArrowDown") {
        setMovingDirection("DOWN");
        startedMovingAt.current = Date.now();
      } else {
        setMovingDirection(null);
        startedMovingAt.current = null;
      }
    });

    document.addEventListener("keyup", () => setMovingDirection(null));
  }, []);

  useEffect(() => {
    setGameState((gameState) => {
      return produce(gameState, (draft) => {
        if (!draft) return draft;
        const player = draft.players.find(
          (p) => p.index === parseInt(currentPlayerIndex || "-1"),
        );

        if (!player) return draft;

        if (!startedMovingAt.current) {
          startedMovingAt.current = Date.now();
          return draft;
        }

        const deltaT = Date.now() - startedMovingAt.current;
        const playerIsAtBottom =
          player.shape.y >= gameState?.canvasHeight - player.shape.height;
        const playerIsAtTop = player.shape.y <= 0;

        if (movingDirection === "DOWN" && !playerIsAtBottom) {
          player.shape.y += 0.1 * deltaT;
        }
        if (movingDirection === "UP" && !playerIsAtTop) {
          player.shape.y -= 0.1 * deltaT;
        }
        console.log("deltaT: ", deltaT);
        if (Date.now() - serverLastNotifiedAt.current > 10) {
          movePlayer(gameId, player.shape.y);
          serverLastNotifiedAt.current = Date.now();
        }
      });
    });
  });
}
