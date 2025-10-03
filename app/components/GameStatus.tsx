import type { Game, GameStatus } from "~/utils/types";

export default function GameStatus({
  gameStatus,
  currentPlayerIndex,
  gameWinner,
}: {
  gameStatus: GameStatus;
  gameWinner: number;
  currentPlayerIndex: number;
}) {
  if (gameWinner !== 0) {
    return (
      <span className="text-2xl m-6">
        {gameWinner === currentPlayerIndex
          ? "You Won!"
          : "Better luck next time!"}
      </span>
    );
  }

  if (gameStatus == "CREATED") {
    return (
      <span className="text-2xl m-6">
        Waiting for another player to join...
      </span>
    );
  }

  return null;
}
