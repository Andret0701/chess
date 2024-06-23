import React, { useEffect, useState, createRef, Fragment } from "react";
import { FEN_STARTING_POSITION, PieceColor, fenToBoard } from "./ChessUtils";
import "./ChessBoard.css";
import { PieceType } from "./ChessUtils";
import ChessPiece from "./ChessPiece";
import { PieceData } from "./ChessPiece";
import PromotionBox from "./PromotionBox";

interface ChessBoardProps {}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const board = fenToBoard(FEN_STARTING_POSITION);

  //use the piece data interface
  const [pieces, setPieces] = useState<PieceData[]>([]);
  //x,y position of the piece
  const [draggingPosition, setDraggingPosition] = useState<
    [number, number] | null
  >(null);

  const [turn, setTurn] = useState<PieceColor>(PieceColor.White);

  const [movedFrom, setMovedFrom] = useState<[number, number] | null>(null);
  const [movedTo, setMovedTo] = useState<[number, number] | null>(null);

  const onGrabStart = (x: number, y: number) => {
    if (draggingPosition !== null) return;
    setDraggingPosition([x, y]);
  };

  const onGrabEnd = (x: number, y: number) => {
    pieces.forEach((p) => {
      p.isDragging = false;
    });

    if (draggingPosition === null || hoveringPosition === null) {
      setDraggingPosition(null);
      setHoveringPosition(null);
      return;
    }
    if (x !== hoveringPosition[0] || y !== hoveringPosition[1]) {
      setDraggingPosition(null);
      setHoveringPosition(null);
      return;
    }
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
            y: colIndex,
            canMove: piece.color === turn
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

    let captured = false;

    pieces.forEach((p) => {
      p.canMove = turn !== p.color;
      if (p.x === to[0] && p.y === to[1]) {
        if (!p.isAlive) return;
        p.isAlive = false;
        captured = true;
      } else if (p.x === from[0] && p.y === from[1]) {
        p.x = to[0];
        p.y = to[1];
      }
    });

    turn === PieceColor.White
      ? setTurn(PieceColor.Black)
      : setTurn(PieceColor.White);

    //play the move sound
    let path = "assets/move.wav";
    if (captured) path = "assets/capture.wav";
    const audio = new Audio(path);
    audio.play();

    setMovedFrom(from);
    setMovedTo(to);

    setPieces([...pieces]);
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      onGrabEnd(0, 0);
    });
  });

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
      <div className="ChessBoardContainer">
        <PromotionBox
          onPromotionSelected={function (piece: PieceType): void {
            console.log(piece);
          }}
          color={PieceColor.White}
          active={draggingPosition !== null}
        />
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
        <PromotionBox
          onPromotionSelected={function (piece: PieceType): void {
            console.log(piece);
          }}
          color={PieceColor.Black}
          active={draggingPosition !== null}
        />
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
