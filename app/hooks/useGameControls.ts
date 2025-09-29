import { useHotkeys } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { movePlayer } from "~/utils/api";

export default function useGameControls(gameId: string) {
  const [isMoving, setIsMoving] = useState(null);

  useEffect(() => {
    console.log("useGameControls");
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        setIsMoving("UP");
      } else if (e.key === "ArrowDown") {
        setIsMoving("DOWN");
      } else {
        setIsMoving(null);
      }
    });

    document.addEventListener("keyup", () => setIsMoving(null));
  }, []);

  useEffect(() => {
    const handleMove = async (direction: string | null) => {
      if (!direction) return;
      await new Promise(() =>
        setTimeout(() => movePlayer(gameId, direction), 10),
      );
    };

    handleMove(isMoving);
  });

  // useHotkeys([["ArrowUp", () => movePlayer(gameId, "UP")]]);
  // useHotkeys([["ArrowDown", () => movePlayer(gameId, "DOWN")]]);
}
