import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="absolute inset-0 bg-[url('/chess-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 text-center p-8">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">
          Challenge Your Mind! ♟️
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Choose your battle: Play against a friend or challenge our AI!
        </p>

        <div className="flex space-x-4">
          <Link
            to="/multiplayer"
            className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md"
          >
            Multiplayer 🏆
          </Link>
          <Link
            to="/playWithComputer"
            className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md"
          >
            Play with AI 🤖
          </Link>
        </div>
      </div>
    </div>
  );
}
