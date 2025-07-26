import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import winsound from '../assets/win.mp3';
import socket from '@/socket';
import { toast } from 'react-toastify';
import { squareStyling } from '@/lib/scuareStyle';

export default function Game({ players, room, orientation, cleanup, username }) {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState('');
  const [squareStyles, setSquareStyles] = useState({});
  const [history, setHistory] = useState([]);
  const [pieceSquare, setPieceSquare] = useState('');
  const { width, height } = useWindowSize();
  const audioRef = useRef(new Audio(winsound));
  const [time, setTime] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const chatRef = useRef(null);
  
  // onDrop function
  function onDrop(sourceSquare, targetSquare) {
    if (chess.turn() !== orientation[0]) return false;
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      // promotion: "q",
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    setFen(chess.fen());
    setHistory(chess.history({ verbose: true }));
    setSquareStyles(() => squareStyling({ pieceSquare, history }));
    socket.emit("move", {
      move,
      room,
    }); // this event will be transmitted to the opponent via the server
    return true;
  }

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render

        if (chess.isGameOver()) {
          // check if move led to "game over"
          if (chess.isCheckmate()) {
            // if reason for game over is a checkmate
            // Set message to checkmate.
            setOver(
              `Checkmate! ${chess.turn() === 'w' ? 'black' : 'white'} wins!`
            );

            if (
              (chess.turn() === 'w' && orientation === 'black') ||
              (chess.turn() === 'b' && orientation === 'white')
            ) {
              audioRef.current.play();
            }

            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) {
            // if it is a draw
            setOver('Draw'); // set message to "Draw"
          } else {
            setOver('Game over');
          }
        }

        return result;
      } catch (e) {
        console.log('error: ', e);

        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess, orientation]
  );

  // keep clicked square style and remove hint squares
  const removeHighlightSquare = () => {
    setSquareStyles(() => squareStyling({ pieceSquare, history }));
  };

  // show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    // const res = squareStyling({ history, pieceSquare });
    // console.log(res);

    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                'radial-gradient(circle, #3F49FF 36%, transparent 40%)',
              borderRadius: '50%',
            },
          },
          // ...res
        };
      },
      {}
    );

    setSquareStyles({ ...highlightStyles });
  };

  const onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    let moves = chess.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  const onSquareClick = (square) => {
    setSquareStyles(() => squareStyling({ pieceSquare: square, history }));
    setPieceSquare(square);
    if (chess.turn() !== orientation[0]) return;

    const moveData = {
      from: pieceSquare,
      to: square,
      color: chess.turn(),
      // promotion: "q",
    };

    const move = makeAMove(moveData);
    // illegal move
    if (move === null) return;

    setFen(chess.fen());
    setHistory(chess.history({ verbose: true }));
    setPieceSquare('');
  };

  const sentMessage = useCallback(
    (message) => {
      socket.emit('sentMessage', {
        roomId: room,
        username: username,
        text: message,
      });
      setChatMessages((prev) => [...prev, { username: username, text: message }]);
      scrollToBottom();
    },
    [room, username]
  );

  const scrollToBottom = () => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    }
  }

  useEffect(() => {
    socket.on('move', (move) => {
      makeAMove(move);
    });
    
    return () => {
      socket.off('move');
    };
  }, [makeAMove]);

  useEffect(() => {
    socket.on('playerDisconnected', (player) => {
      setOver(`${player.username} has disconnected`);
      toast.error(`${player.username} has disconnected`);
      cleanup();
    });
    return () => {
      socket.off('playerDisconnected');
    };
  }, [cleanup]);

  useEffect(() => {
    socket.on('closeRoom', ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
    
    return () => {
      socket.off('closeRoom');
    };
  }, [room, cleanup]);

  useEffect(() => {
    socket.on('sendedMessage', (message) => {
      setChatMessages((prev) => [...prev, message]);
      scrollToBottom();
    });
    
    return () => {
      socket.off('sendedMessage');
    };
  }, [sentMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game component returned jsx
  return (
    <div className='bg-gray-900 text-white w-full lg:h-screen'>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
        run={
          over.includes('wins') &&
          ((over.includes('black') && orientation === 'black') ||
            (over.includes('white') && orientation === 'white'))
        }
      />
      <div className='container mx-auto flex flex-col justify-center items-centers md:w-2/3'>
        {over && (
            <div
              className={`${
                over.includes('Draw')
                  ? 'bg-yellow-500'
                  : over.includes('wins') &&
                    ((over.includes('black') && orientation === 'black') ||
                      (over.includes('white') && orientation === 'white'))
                  ? 'bg-green-500'
                  : 'bg-red-500'
              } absolute shadow-md text-white py-3 rounded-md mb-4 px-4 my-1`}
            >
              {over}
            </div>
          )}
        <div className="my-2 flex flex-row items-center justify-between bg-gray-800 rounded-md shadow-md p-4 mb-4 w-full">
          <h2 className="text-2xl font-bold">Chess</h2>
          <p className='m-0'>Turn: {chess.turn()==='w' ? 'White' : 'Black'}</p>
          <p className='m-0'>Time: {time}s</p>
        </div>
        <div className="flex md:flex-row justify-between w-full flex-col">
          <div
            className="board md:w-1/2 w-full"
            style={{
              maxWidth: 700,
              maxHeight: 700,
              flexGrow: 1,
            }}
          >
            <Chessboard
              id="humanVsHuman"
              position={fen}
              onPieceDrop={onDrop}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
              onSquareClick={onSquareClick}
              boardOrientation={orientation}
              customBoardStyle={{
                borderRadius: '5px',
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
              }}
              customSquareStyles={squareStyles}
            />
          </div>
          <div className='flex flex-col w-full max-w-md ms-4 sm:mt-4'>
            <div className='border-collapse border-2 w-full border-gray-700 rounded-lg p-4 mb-4 max-h-40'>
              <h2 className="text-2xl font-bold">Players:</h2>
              <ul className="list-disc list-inside">
                {players.map((player) => (
                  <li key={player.id} className="text-lg">
                    {player.username} ({player.orientation})
                  </li>
                ))}
              </ul>
            </div>
            <div className='border-collapse border-2 w-full border-gray-700 rounded-lg p-4 mb-4'>
              <h2 className="text-2xl font-bold text-center">Chat:</h2>
              <ul ref={chatRef} className="list-inside h-60 overflow-y-scroll pe-1" style={{ scrollbarColor: '#4A5568 #2D3748' }}>
                {chatMessages.map((message, index) => (
                  <li key={index} className={`text-lg py-2 px-3 rounded-md bg-gray-700 max-w-2/3 mb-1 break-words ${message.username == username ? 'justify-self-end' : 'justify-self-start'}`} style={{width: 'max-content', maxWidth: '50%'}}>
                    <strong className='text-blue-500'>{message.username}:</strong> {message.text}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                      sentMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
