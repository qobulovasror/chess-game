import { useState } from "react";
import { Link } from "react-router-dom";

export default function Multiplayer() {
  const [gameCode, setGameCode] = useState("");

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/chess-bg.jpg')] bg-cover bg-center opacity-15"></div>

      {/* Kontent */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl font-bold mb-6">Multiplayer Mode ♟️</h1>
        <p className="text-lg mb-8 opacity-80">Create a game or join an existing one</p>

        <div className="flex flex-col space-y-4">
          {/* Create Game */}
          <Link
            to="/multiplayer/create"
            className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md"
          >
            Create Game 🎲
          </Link>

          {/* Join Game */}
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter Game Code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="px-4 py-2 rounded-lg text-black"
            />
            <button
              className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-md ${
                gameCode ? "bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105" : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!gameCode}
            >
              Join Game 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
