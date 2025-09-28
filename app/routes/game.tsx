import { Circle, Layer, Rect, Stage } from "react-konva";
import { useParams } from "react-router";
import useGameControls from "~/hooks/useGameControls";
import useGameState from "~/hooks/useGameState";
import { pauseGame, startGame } from "~/utils/api";

export default function Game() {
  const { gameId } = useParams();

  if (!gameId) return null;

  const { gameState, currentPlayerIndex } = useGameState(gameId);
  useGameControls(gameId);

  return (
    <div className="bg-[rgb(37,71,114)] h-full flex flex-col">
      {/*<div className="border-violet-600 border-1">*/}
      <Stage
        height={gameState?.canvasHeight || 700}
        width={gameState?.canvasWidth || 700}
        className="flex"
      >
        <Layer>
          {gameState?.players.map((player) => (
            <Rect
              x={player.shape.x}
              y={player.shape.y}
              width={player.shape.width}
              height={100}
              fill="red"
            />
          ))}
          {gameState?.ball && (
            <Circle
              x={gameState.ball.Shape.x}
              y={gameState.ball.Shape.y}
              width={gameState.ball.Shape.width}
              fill="blue"
              shadowBlur={10}
            />
          )}
        </Layer>
      </Stage>
      {/*</div>*/}

      {currentPlayerIndex === 1 && gameState?.gameStatus === "PAUSED" && (
        <button
          className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-lg bottom-10 left-1/2 transform absolute"
          onClick={() => startGame(gameId)}
        >
          Start
        </button>
      )}
      {currentPlayerIndex === 1 && gameState?.gameStatus === "PLAYED" && (
        <button
          className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-lg bottom-10 left-1/2 transform absolute"
          onClick={() => pauseGame(gameId)}
        >
          Pause
        </button>
      )}
    </div>
  );
}
