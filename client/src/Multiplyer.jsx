import { MoveLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';

export default function Multiplayer() {
  const [userName, setUserName] = useState('');
  const [gameCode, setGameCode] = useState('');

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/chess-bg.jpg')] bg-cover bg-center opacity-15"></div>
      {/* Kontent */}
      <div className="relative z-10 text-center p-8">
        <div className="flex justify-start w-full mb-3">
          <Link
            to="/"
            title="Back to Home"
            className="btn bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-all duration-300"
          >
            <MoveLeft />
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-6">Multiplayer Mode ♟️</h1>
        <p className="text-lg mb-8 opacity-80">
          Create a game or join an existing one
        </p>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={userName}
            minLength={1}
            maxLength={50}
            onChange={(e) => setUserName(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          />
          {/* Create Game */}
          <Button
            disabled={!userName}
            className={`btn px-6 py-3 text-lg font-semibold bg-blue-600 ${
              userName
                ? 'hover:bg-blue-700 hover:scale-105 transition-all duration-300'
                : 'cursor-not-allowed'
            } transform rounded-xl shadow-md`}
          >
            Create Game 🎲
          </Button>

          <hr className='my-3'/>

          {/* Join Game */}
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter Game Code"
              value={gameCode}
              minLength={4}
              maxLength={15}
              onChange={(e) => setGameCode(e.target.value)}
              className="px-4 py-2 rounded-lg text-black"
            />
            <button
              className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-md ${
                gameCode.length > 3
                  ? 'bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
              disabled={gameCode.length < 4}
            >
              Join Game 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
