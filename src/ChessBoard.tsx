import React, { useEffect, useState, createRef, Fragment } from "react";
import { FEN_STARTING_POSITION, fenToBoard } from "./ChessUtils";
import "./ChessBoard.css";
import { PieceType } from "./ChessUtils";
import ChessPiece from "./ChessPiece";
import { PieceData } from "./ChessPiece";

interface ChessBoardProps {}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const board = fenToBoard(FEN_STARTING_POSITION);

  //use the piece data interface
  const [pieces, setPieces] = useState<PieceData[]>([]);
  //x,y position of the piece
  const [draggingPosition, setDraggingPosition] = useState<
    [number, number] | null
  >(null);

  const [movedFrom, setMovedFrom] = useState<[number, number] | null>(null);
  const [movedTo, setMovedTo] = useState<[number, number] | null>(null);

  const onGrabStart = (x: number, y: number) => {
    if (draggingPosition !== null) return;
    setDraggingPosition([x, y]);
  };

  const onGrabEnd = (x: number, y: number) => {
    if (draggingPosition === null || hoveringPosition === null) return;
    if (x !== hoveringPosition[0] || y !== hoveringPosition[1]) {
      setDraggingPosition(null);
      setHoveringPosition(null);
      return;
    }

    pieces.forEach((p) => {
      p.isDragging = false;
    });
    setPieces([...pieces]);

    movePiece(draggingPosition, hoveringPosition);
    setDraggingPosition(null);
    setHoveringPosition(null);
  };

  useEffect(() => {
    const mappedPieces = board
      .map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          return {
            id: `${rowIndex}-${colIndex}`,
            color: piece.color,
            type: piece.type,
            isAlive: true,
            isDragging: false,
            x: rowIndex,
            y: colIndex
          };
        })
      )
      .flat()
      .filter((piece) => piece.type !== PieceType.Empty);

    setPieces(mappedPieces);
  }, []);

  const [tileRefs, setTileRefs] = useState<React.RefObject<HTMLDivElement>[][]>(
    []
  );
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

  const getPieceAtPosition = (position: [number, number]) => {
    return pieces.find(
      (piece) => piece.x === position[0] && piece.y === position[1]
    );
  };

  const movePiece = (from: [number, number], to: [number, number]) => {
    if (from[0] === to[0] && from[1] === to[1]) return;

    const piece = getPieceAtPosition(from);
    if (!piece) return;
    pieces.forEach((p) => {
      if (p.x === to[0] && p.y === to[1]) {
        p.isAlive = false;
      } else if (p.x === from[0] && p.y === from[1]) {
        p.x = to[0];
        p.y = to[1];
      }
    });

    //play the move sound
    const audio = new Audio("assets/move.wav");
    audio.play();

    setMovedFrom(from);
    setMovedTo(to);
    setPieces([...pieces]);
  };

  const positionsEqual = (
    pos1: [number, number] | null,
    pos2: [number, number] | null
  ) => {
    if (pos1 === null || pos2 === null) return false;
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
  };

  if (tileRefs.length === 0) return null; // Ensure tileRefs is initialized before rendering

  return (
    <>
      <div className="ChessBoard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flex: 1 }}>
            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`Square`}
                ref={tileRefs[rowIndex][colIndex]}
                style={{
                  //make edge of the square
                  boxSizing: "border-box",
                  // Apply border conditionally
                  border:
                    hoveringPosition &&
                    rowIndex === hoveringPosition[0] &&
                    colIndex === hoveringPosition[1]
                      ? (rowIndex + colIndex) % 2 === 0
                        ? "5px solid var(--light-selected-color)"
                        : "5px solid var(--dark-selected-color)"
                      : "none",

                  backgroundColor:
                    positionsEqual([rowIndex, colIndex], movedFrom) ||
                    positionsEqual([rowIndex, colIndex], movedTo)
                      ? (rowIndex + colIndex) % 2 === 0
                        ? "var(--light-moved-color)"
                        : "var(--dark-moved-color)"
                      : (rowIndex + colIndex) % 2 === 0
                      ? "var(--light-color)"
                      : "var(--dark-color)"
                }}
              >
                {draggingPosition && (
                  <div
                    style={{
                      zIndex: 9999,
                      width: "100%",
                      height: "100%"
                    }}
                    onMouseEnter={() => {
                      if (
                        hoveringPosition !== null &&
                        hoveringPosition[0] === rowIndex &&
                        hoveringPosition[1] === colIndex
                      )
                        return;
                      setHoveringPosition([rowIndex, colIndex]);
                    }}
                    onMouseLeave={() => {
                      if (
                        hoveringPosition !== null &&
                        hoveringPosition[0] === rowIndex &&
                        hoveringPosition[1] === colIndex
                      )
                        setHoveringPosition(null);
                    }}
                    onMouseUp={() => onGrabEnd(rowIndex, colIndex)}
                  ></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h1 style={{ color: "white" }}>
        {hoveringPosition
          ? `Hovering over: ${hoveringPosition[0]}, ${hoveringPosition[1]}`
          : "Not hovering"}
      </h1>

      <div className="ChessPieces">
        {pieces.map((piece) => (
          <ChessPiece
            key={piece.id}
            piece={piece}
            tileRef={tileRefs[piece.x][piece.y]}
            onGrabStart={onGrabStart}
          />
        ))}
      </div>
    </>
  );
};

export default ChessBoard;
