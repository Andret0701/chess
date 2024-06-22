import React, { useEffect, useState, createRef, Fragment } from "react";
import { FEN_STARTING_POSITION, fenToBoard } from "./ChessUtils";
import "./ChessBoard.css";
import { PieceType } from "./ChessUtils";
import ChessPiece from "./ChessPiece";

interface ChessBoardProps {}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const board = fenToBoard(FEN_STARTING_POSITION);

  const [tileRefs, setTileRefs] = useState<React.RefObject<HTMLDivElement>[][]>(
    []
  );
  const [number, setNumber] = useState<number>(0);
  const [hoveringPosition, setHoveringPosition] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    const refs = board.map((row) => row.map(() => createRef<HTMLDivElement>()));
    if (refs.length === 0) return;
    if (tileRefs.length === 0) {
      setTileRefs(refs);
      return;
    }
    for (let i = 0; i < refs.length; i++) {
      for (let j = 0; j < refs[i].length; j++) {
        if (tileRefs[i][j] !== refs[i][j]) return;
      }
    }
    setTileRefs(refs);
  }, [board]);

  if (tileRefs.length === 0) return null; // Ensure tileRefs is initialized before rendering

  return (
    <>
      <div className="ChessBoard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flex: 1 }}>
            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`Square ${
                  (rowIndex + colIndex) % 2 === 0 ? "Light" : "Dark"
                }`}
                ref={tileRefs[rowIndex][colIndex]}
                onMouseEnter={() => {
                  if (
                    hoveringPosition !== null &&
                    hoveringPosition[0] === rowIndex &&
                    hoveringPosition[1] === colIndex
                  )
                    return;
                  setHoveringPosition([rowIndex, colIndex]);
                  //console.log("hoveringPosition", hoveringPosition, number);
                  setNumber(number + 1);
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="ChessPieces">
        {board.map((row, rowIndex) =>
          row.map(
            (piece, colIndex) =>
              piece.type !== PieceType.Empty && (
                <ChessPiece
                  key={`${rowIndex}-${colIndex}`}
                  color={piece.color}
                  type={piece.type}
                  tileRef={tileRefs[rowIndex][colIndex]}
                />
              )
          )
        )}
      </div>
    </>
  );
};

export default ChessBoard;
