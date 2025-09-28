import axios from "axios";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

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
    <div className="bg-[url('/banner.png')] bg-cover h-full w-full">
      {/*<img src="/banner.png" />*/}
      <button
        onClick={createGame}
        className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-lg bottom-10 left-1/2 transform absolute"
      >
        Create Game
      </button>
    </div>
  );
}
