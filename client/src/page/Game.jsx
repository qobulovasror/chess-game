import { useState, useMemo, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
// import CustomDialog from "./components/CustomDialog";
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import winsound from '../assets/win.mp3';

export default function Game({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("Draw");
  const [squareStyles, setSquareStyles] = useState({});
  const [history, setHistory] = useState([]);
  const [pieceSquare, setPieceSquare] = useState('');
  const { width, height } = useWindowSize();
  const audioRef = useRef(new Audio(winsound));

  // onDrop function
  function onDrop(sourceSquare, targetSquare) {
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
    return true;
  }

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render

        console.log('over, checkmate', chess.isGameOver(), chess.isCheckmate());

        if (chess.isGameOver()) {
          // check if move led to "game over"
          if (chess.isCheckmate()) {
            // if reason for game over is a checkmate
            // Set message to checkmate.
            setOver(
              `Checkmate! ${chess.turn() === 'w' ? 'black' : 'white'} wins!`
            );

            if(chess.turn() === 'w' && orientation === 'black' || chess.turn() === 'b' && orientation === 'white') {
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
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );

  // keep clicked square style and remove hint squares
  const removeHighlightSquare = () => {
    console.log('removeHighlightSquare');

    setSquareStyles(() => squareStyling({ pieceSquare, history }));
  };

  // show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    console.log('highlightSquare', sourceSquare, squaresToHighlight);
    const res = squareStyling({ history, pieceSquare });
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

  // Game component returned jsx
  return (
    <div className='bg-gray-900 text-white w-full h-screen'>
      <Confetti 
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
        run={over.includes('wins') && ((over.includes('black') && orientation === 'black') || over.includes('white') && (orientation === 'white'))}
      />
      <div className='container mx-auto flex flex-col justify-center items-center'>
        {
          over && (
            <div
              className={`${
                over.includes('Draw') ? 
                  'bg-yellow-500' : 
                  (over.includes('wins') && ((over.includes('black') && orientation === 'black') || over.includes('white') && (orientation === 'white')) ? 
                    'bg-green-500' : 
                    'bg-red-500')} absolute shadow-md text-white py-3 rounded-md mb-4 px-4 my-1`}
            >
              {over}
            </div>
          )
        }
        <div className="my-2 bg-gray-800 rounded-md shadow-md p-4 mb-4 w-full">
          <h2 className="text-2xl font-bold">Game Room: {room}</h2>
        </div>
        <div
          className="board"
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
            orientation={orientation}
            customBoardStyle={{
              borderRadius: '5px',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
            customSquareStyles={squareStyles}
          />
        </div>
      </div>
    </div>
  );
}

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { border: '5px solid #FFFF00A8' },
    ...(history.length && {
      [sourceSquare]: {
        border: '5px solid #FFFF00A8',
      },
    }),
    ...(history.length && {
      [targetSquare]: {
        border: '5px solid #FFFF00A8',
      },
    }),
  };
};
