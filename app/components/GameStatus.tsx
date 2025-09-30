import type { Game } from "~/utils/types";

export default function GameStatus({
  game,
  currentPlayerIndex,
}: {
  game: Game;
  currentPlayerIndex: number;
}) {
  console.log("game winner: ", game.winner);
  if (game.winner !== 0) {
    return (
      <span className="text-2xl m-6">
        {game.winner === currentPlayerIndex
          ? "You Won!"
          : "Better luck next time!"}
      </span>
    );
  }

  if (game.gameStatus == "PAUSED" && game.players.length < 2) {
    return (
      <span className="text-2xl m-6">
        Waiting for another player to join...
      </span>
    );
  }

  return null;
}
