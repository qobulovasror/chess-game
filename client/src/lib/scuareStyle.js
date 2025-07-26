export const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { border: '3px solid #FFFF00A8' },
    ...(history.length && {
      [sourceSquare]: {
        border: '3px solid #FFFF00A8',
      },
    }),
    ...(history.length && {
      [targetSquare]: {
        border: '3px solid #FFFF00A8',
      },
    }),
  };
};