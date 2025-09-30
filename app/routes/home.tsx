import axios from "axios";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

console.log("env: ", `${JSON.stringify(import.meta.env)}`);

export default function Home() {
  const navigate = useNavigate();

  const createGame = () => {
    console.log("createGame()");
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/create-game`)
      .then((response) => {
        const gameId = response.data.gameId;
        const playerIndex = response.data.playerIndex;

        // Set playerIndex locally
        localStorage.setItem("PADDLE_BALL_PLAYER_INDEX", playerIndex);

        navigate(`/game/${gameId}`);
      });
  };

  return (
    <div className=" bg-[var(--primary-color)]  flex flex-col items-center justify-center h-full gap-10">
      <span className="text-[var(--secondary-color))] font-bold text-9xl block">
        PONG
      </span>
      <button
        onClick={createGame}
        className="bg-[var(--primary-color)] text-[var(--secondary-color)] border-[var(--secondary-color)] border-2 py-4 px-6 rounded-lg font-semibold text-5xl hover:translate-y-1 cursor-pointer"
      >
        Play
      </button>
    </div>
  );
}
