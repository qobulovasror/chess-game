import { Copy, MoveLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Game from './Game';
import { toast } from 'react-toastify';
import socket from '@/socket';

export default function Multiplayer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [userName, setUserName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState('');
  const [orientation, setOrientation] = useState('');

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setUserName('');
    setGameCode('');
    setOrientation('');
    setRoom('');
    setPlayers([]);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    socket.on('opponentJoined', (roomData) => {
      console.log('roomData', roomData);
      setPlayers(roomData.players);
    });
    socket.on('joinedRoom', (roomData) => {
      console.log('joinedRoom', roomData);
      setRoom(roomData.roomId);
      setOrientation('black');
      setGameStarted(true);
    });
    socket.on('closeRoom', (data) => {
      toast.info(`Room ${data.roomId} has been closed`);
      setGameStarted(false);
      cleanup();
    });
    socket.on('playerDisconnected', (user) => { 
      toast.info(`${user.username} has disconnected`);
      setGameStarted(false);
      cleanup();
    });
  }, [cleanup]);

  // return (
  //   <div>
  //     {gameStarted && room ? (
  //       <Game
  //         players={players}
  //         userName={userName}
  //         room={room}
  //         orientation={orientation}
  //         cleanup={cleanup}
  //       />
  //     ) : (
  //       <BeforeStart
  //         userName={userName}
  //         setUserName={setUserName}
  //         setGameStarted={setGameStarted}
  //         gameCode={gameCode}
  //         setGameCode={setGameCode}
  //         setRoom={setRoom}
  //         room={room}
  //         players={players}
  //         setPlayers={setPlayers}
  //         cleanup={cleanup}
  //         setOrientation={setOrientation}
  //       />
  //     )}
  //   </div>
  // );
  return (
    <div>
        <Game
          players={players}
          userName={userName}
          room={room}
          orientation={orientation}
          cleanup={cleanup}
        />
    </div>
  );
}

const BeforeStart = (props) => {
  const {
    userName,
    setUserName,
    setGameStarted,
    gameCode,
    setGameCode,
    setRoom,
    room,
    setOrientation,
    players,
    setPlayers,
    cleanup,
  } = props;
  const [gameType, setGameType] = useState('create');
  const [isWaiting, setIsWaiting] = useState(false);
  const handleCreateGame = () => {
    if (!userName) return toast.error('Please enter a username');
    setGameType('create');
    setIsWaiting(true);
    socket.emit('username', userName);
    socket.emit('createRoom', (r) => {
      setRoom(r);
      setPlayers([{ id: socket.id, username: userName, orientation: 'white' }]);
      setOrientation('white');
    });
  };

  const handleJoinGame = () => {
    if (!userName) return toast.error('Please enter a username');
    if (!gameCode) return toast.error('Please enter a game code');
    if (gameCode.length < 4) {
      return toast.error('Please enter a valid game code');
    }
    socket.emit('username', userName);
    socket.emit('joinRoom', { roomId: gameCode }, (r) => {
      // r is the response from the server
      if (r.error)
        return toast.error(r.message ? r.message : 'Error joining room'); // if an error is returned in the response set roomError to the error message and exit
      console.log('response:', r);
      setRoom(r?.roomId); // set room to the room ID
      setPlayers(r?.players); // set players array to the array of players in the room
      setOrientation('black'); // set orientation as black
      setGameType('join');
      setIsWaiting(true);
    });
  };

  useEffect(() => {
    socket.on('startedGame', () => {
      toast.info('Game started');
      setIsWaiting(false);
      setGameStarted(true);
    });

    return () => {
      socket.off('startedGame');
    };
  }, [setGameStarted]);
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white">
      {isWaiting && (
        <WaitingForPlayers
          gameType={gameType}
          players={players}
          room={room}
          setIsWaiting={setIsWaiting}
          setGameStarted={setGameStarted}
          cleanup={cleanup}
        />
      )}
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
            onClick={handleCreateGame}
            className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 transform rounded-xl shadow-md"
          >
            Create Game 🎲
          </Button>

          <hr className="my-3" />

          {/* Join Game */}
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter Game Code"
              value={gameCode}
              minLength={4}
              onChange={(e) => setGameCode(e.target.value)}
              className="px-4 py-2 rounded-lg text-black"
            />
            <button
              className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-md ${
                gameCode.length > 3
                  ? 'bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
              onClick={handleJoinGame}
            >
              Join Game 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WaitingForPlayers = (props) => {
  const { gameType, setIsWaiting, setGameStarted, room, players, cleanup } =
    props;

  const startGame = () => {
    socket.emit('startGame', room);
    toast.info('Game started');
    setIsWaiting(false);
    setGameStarted(true);
  };

  const cancelGame = () => {
    setIsWaiting(false);
    setGameStarted(false);
    socket.emit('closeRoom', room);
    toast.info('Game cancelled');
    cleanup();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white z-20">
      <h2 className="text-2xl font-bold mb-4">
        {gameType === 'create'
          ? 'Waiting for another player to join...'
          : 'Waiting for game creator allowance...'}
      </h2>

      <div className="my-4 flex flex-col">
        <p className="text-lg">Room ID:</p>

        <p className="text-lg flex justify-between align-baseline">
          <span className="font-bold mt-1">{room}</span>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(room);
              toast.success('Room ID copied to clipboard!');
            }}
            className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 rounded-lg ms-1"
          >
            <Copy />
          </Button>
        </p>
      </div>

      <div className="text-lg mb-4">
        Players: {players.length} / 2
        {players.length > 0 && (
          <ul className="list-disc list-inside mt-2">
            {players.map((player, index) => (
              <li key={index} className="text-white">
                {player.username}{' '}
                {player.orientation
                  ? player.orientation
                  : player.id == socket.id
                  ? 'white'
                  : 'black'}{' '}
                {player.id === socket.id ? '(You)' : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      {gameType === 'create' ? (
        <div className="flex mt-5 justify-around w-full max-w-md">
          <Button
            onClick={startGame}
            disabled={players.length < 2}
            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-lg"
          >
            Start Game
          </Button>
          <Button
            onClick={cancelGame}
            className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex mt-5 justify-around w-full max-w-md">
          <p className="text-lg">Waiting for creator to start the game...</p>
        </div>
      )}
    </div>
  );
};
