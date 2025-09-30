import { Circle, Layer, Rect, Stage } from "react-konva";
import { useParams } from "react-router";
import GameStatus from "~/components/GameStatus";
import PlayerInviteModal from "~/components/PlayerInviteModal";
import useGameControls from "~/hooks/useGameControls";
import useGameState from "~/hooks/useGameState";
import { pauseGame, startGame } from "~/utils/api";

export default function Game() {
  const { gameId } = useParams();

  if (!gameId) return null;

  const { gameState, currentPlayerIndex } = useGameState(gameId);
  useGameControls(gameId);

  return (
    <div className="bg-[rgb(18,18,64)] h-full flex flex-col justify-center items-center">
      <PlayerInviteModal open={currentPlayerIndex === 1} />
      {gameState && (
        <GameStatus game={gameState} currentPlayerIndex={currentPlayerIndex} />
      )}
      <Stage
        height={gameState?.canvasHeight || 700}
        width={gameState?.canvasWidth || 700}
        className="flex"
      >
        <Layer>
          {gameState?.players.map((player, i) => (
            <Rect
              key={player.index}
              x={player.shape.x}
              y={player.shape.y}
              width={player.shape.width}
              height={player.shape.height}
              fill={i === 1 ? "rgb(51, 217, 243)" : "rgb(252, 0, 134)"}
            />
          ))}
          {gameState?.ball && (
            <Rect
              x={gameState.ball.Shape.x}
              y={gameState.ball.Shape.y}
              width={gameState.ball.Shape.width}
              height={gameState.ball.Shape.width}
              fill="white"
            />
          )}
        </Layer>
      </Stage>

      {currentPlayerIndex === 1 && gameState?.gameStatus === "PAUSED" && (
        <button
          onClick={() => startGame(gameId)}
          className="bg-[var(--primary-color)] text-[var(--secondary-color)] border-[var(--secondary-color)] border-2 py-4 px-6 rounded-lg font-semibold text-5xl hover:translate-y-1 cursor-pointer absolute bottom-10"
        >
          Play
        </button>
      )}
      {currentPlayerIndex === 1 && gameState?.gameStatus === "PLAYED" && (
        <button
          onClick={() => pauseGame(gameId)}
          className="bg-[var(--primary-color)] text-[var(--secondary-color)] border-[var(--secondary-color)] border-2 py-4 px-6 rounded-lg font-semibold text-5xl hover:translate-y-1 cursor-pointer absolute bottom-10"
        >
          Pause
        </button>
      )}
    </div>
  );
}
