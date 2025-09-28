import { useHotkeys } from "@mantine/hooks";
import { movePlayer } from "~/utils/api";

export default function useGameControls(gameId: string) {
  useHotkeys([["ArrowUp", () => movePlayer(gameId, "UP")]]);
  useHotkeys([["ArrowDown", () => movePlayer(gameId, "DOWN")]]);
}
