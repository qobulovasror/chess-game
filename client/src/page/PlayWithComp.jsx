import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const boardStyle = {
  borderRadius: '5px',
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
};

// Use a working CDN version of Stockfish
const STOCKFISH_PATH = 'https://cdn.jsdelivr.net/gh/nmrugg/stockfish.js/src/stockfish.asm.js';

function PlayWithComputer() {
  const [fen, setFen] = useState('start');
  const [engine, setEngine] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef(new Chess());
  const engineRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setFen(gameRef.current.fen());
    const newEngine = engineGame();
    newEngine.prepareMove();
    setEngine(newEngine);
    engineRef.current = newEngine;
    
    return () => {
      // Cleanup: terminate workers and clear interval
      if (engineRef.current && engineRef.current.terminate) {
        engineRef.current.terminate();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!engine || gameOver) return false;
    const game = gameRef.current;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    if (!move) return false;
    setFen(game.fen());
    
    // Check if game is over after player move
    if (game.isGameOver()) {
      setGameOver(true);
      return true;
    }
    
    engine.prepareMove();
    return true;
  };

  const engineGame = () => {
    // Create a blob URL for the Stockfish worker
    const stockfishBlob = new Blob([`
      importScripts('${STOCKFISH_PATH}');
    `], { type: 'application/javascript' });
    
    let engine = new Worker(URL.createObjectURL(stockfishBlob));
    let evaler = new Worker(URL.createObjectURL(stockfishBlob));
    let engineStatus = {};
    let time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
    let clockTimeoutID = null;
    let announced_isGameOver = false;

    intervalRef.current = setInterval(function () {
      if (announced_isGameOver) {
        return;
      }
      if (gameRef.current.isGameOver()) {
        announced_isGameOver = true;
        setGameOver(true);
      }
    }, 500);

    function uciCmd(cmd, which) {
      (which || engine).postMessage(cmd);
    }
    uciCmd('uci');

    function clockTick() {
      let t =
        (time.clockColor === 'white' ? time.wtime : time.btime) +
        time.startTime -
        Date.now();
      let timeToNextSecond = (t % 1000) + 1;
      clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
    }

    function stopClock() {
      if (clockTimeoutID !== null) {
        clearTimeout(clockTimeoutID);
        clockTimeoutID = null;
      }
      if (time.startTime > 0) {
        let elapsed = Date.now() - time.startTime;
        time.startTime = null;
        if (time.clockColor === 'white') {
          time.wtime = Math.max(0, time.wtime - elapsed);
        } else {
          time.btime = Math.max(0, time.btime - elapsed);
        }
      }
    }

    function startClock() {
      if (gameRef.current.turn() === 'w') {
        time.wtime += time.winc;
        time.clockColor = 'white';
      } else {
        time.btime += time.binc;
        time.clockColor = 'black';
      }
      time.startTime = Date.now();
      clockTick();
    }

    function get_moves() {
      let moves = '';
      let history = gameRef.current.history({ verbose: true });
      for (let i = 0; i < history.length; ++i) {
        let move = history[i];
        moves +=
          ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
      }
      return moves;
    }

    const prepareMove = () => {
      stopClock();
      let turn = gameRef.current.turn() === 'w' ? 'white' : 'black';
      if (!gameRef.current.isGameOver()) {
        if (turn !== 'white') {
          uciCmd('position startpos moves' + get_moves());
          uciCmd('position startpos moves' + get_moves(), evaler);
          uciCmd('eval', evaler);
          if (time && time.wtime) {
            uciCmd(
              'go ' +
                (time.depth ? 'depth ' + time.depth : '') +
                ' wtime ' +
                time.wtime +
                ' winc ' +
                time.winc +
                ' btime ' +
                time.btime +
                ' binc ' +
                time.binc
            );
          } else {
            uciCmd('go ' + (time.depth ? 'depth ' + time.depth : ''));
          }
        }
        if (gameRef.current.history().length >= 2 && !time.depth && !time.nodes) {
          startClock();
        }
      }
    };

    evaler.onmessage = function (event) {
      let line = event && typeof event === 'object' ? event.data : event;
      if (
        line === 'uciok' ||
        line === 'readyok' ||
        line.substr(0, 11) === 'option name'
      ) {
        return;
      }
    };

    engine.onmessage = (event) => {
      let line = event && typeof event === 'object' ? event.data : event;
      if (line === 'uciok') {
        engineStatus.engineLoaded = true;
      } else if (line === 'readyok') {
        engineStatus.engineReady = true;
      } else {
        let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
        if (match) {
          gameRef.current.move({ from: match[1], to: match[2], promotion: match[3] });
          setFen(gameRef.current.fen());
          
          // Check if game is over after engine move
          if (gameRef.current.isGameOver()) {
            setGameOver(true);
            return;
          }
          
          prepareMove();
          uciCmd('eval', evaler);
        } else if (
          (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
        ) {
          engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
        }
        if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
          let score = parseInt(match[2], 10) * (gameRef.current.turn() === 'w' ? 1 : -1);
          if (match[1] === 'cp') {
            engineStatus.score = (score / 100.0).toFixed(2);
          } else if (match[1] === 'mate') {
            engineStatus.score = 'Mate in ' + Math.abs(score);
          }
          if ((match = line.match(/\b(upper|lower)bound\b/))) {
            engineStatus.score =
              ((match[1] === 'upper') === (gameRef.current.turn() === 'w')
                ? '<= '
                : '>= ') + engineStatus.score;
          }
        }
      }
    };

    // Add terminate method for cleanup
    return {
      start: function () {
        uciCmd('ucinewgame');
        uciCmd('isready');
        engineStatus.engineReady = false;
        engineStatus.search = null;
        prepareMove();
        announced_isGameOver = false;
      },
      prepareMove: function () {
        prepareMove();
      },
      terminate: function () {
        engine.terminate();
        evaler.terminate();
      },
    };
  };

  const getGameStatus = () => {
    if (gameOver) {
      if (gameRef.current.isCheckmate()) {
        return gameRef.current.turn() === 'w' ? 'Black wins!' : 'White wins!';
      } else if (gameRef.current.isDraw()) {
        return 'Draw!';
      } else if (gameRef.current.isStalemate()) {
        return 'Stalemate!';
      }
    }
    return `Turn: ${gameRef.current.turn() === 'w' ? 'White' : 'Black'}`;
  };

  return (
    <div className='bg-gray-900 text-white w-full h-screen'>
      <div className='container mx-auto flex flex-col justify-center items-center md:w-2/3'>
        <div className="my-2 flex flex-row items-center justify-between bg-gray-800 rounded-md shadow-md p-4 mb-4 w-full">
          <h2 className="text-2xl font-bold">Chess vs Computer</h2>
          <p className="text-sm text-red-500 opacity-80">
            Sorry, currently this feature is not working.
          </p>
          <p className='m-0'>{getGameStatus()}</p>
        </div>
        <div className="flex justify-center w-full lg:w-1/2">
          <Chessboard
            id="stockfish"
            position={fen}
            onDrop={onDrop}
            width={320}
            boardStyle={boardStyle}
            orientation="white"
          />
        </div>
      </div>
    </div>
  );
}

export default PlayWithComputer;
