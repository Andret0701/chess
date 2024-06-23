import React, { useEffect, useState, createRef, Fragment } from "react";
import {
  FEN_STARTING_POSITION,
  PieceColor,
  Vector2,
  fenToBoard
} from "./ChessUtils";
import "./ChessBoard.css";
import { PieceType } from "./ChessUtils";
import ChessPiece from "./ChessPiece";
import { PieceData } from "./ChessPiece";
import PromotionBox from "./PromotionBox";
import { MoveAction, MoveLog, TakeAction } from "./MoveLog";
import chessSound from "./ChessSound";

interface ChessBoardProps {
  //prop that canc all newGame function
  newGame?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const [board, setBoard] = useState(fenToBoard(FEN_STARTING_POSITION));

  const newGame = () => {
    setBoard(fenToBoard(FEN_STARTING_POSITION));
  };

  useEffect(() => {
    if (!props.newGame) return;

    newGame();
  }, [props.newGame]);

  //use the piece data interface
  const [pieces, setPieces] = useState<PieceData[]>([]);
  //x,y position of the piece
  const [draggingPosition, setDraggingPosition] = useState<
    [number, number] | null
  >(null);

  const [movedFrom, setMovedFrom] = useState<Vector2 | null>(null);
  const [movedTo, setMovedTo] = useState<Vector2 | null>(null);

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
    //make sure its updated

    const mappedPieces = board.board
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
            canMove: piece.color === board.turn
          };
        })
      )
      .flat()
      .filter((piece) => piece.type !== PieceType.Empty);

    setPieces(mappedPieces);
  }, [board]);

  const [tileRefs, setTileRefs] = useState<React.RefObject<HTMLDivElement>[][]>(
    []
  );
  const [hoveringPosition, setHoveringPosition] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    const refs = board.board.map((row) =>
      row.map(() => createRef<HTMLDivElement>())
    );
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
      (piece) =>
        piece.x === position[0] && piece.y === position[1] && piece.isAlive
    );
  };

  const movePiece = (from: [number, number], to: [number, number]) => {
    if (from[0] === to[0] && from[1] === to[1]) return;

    const piece = getPieceAtPosition(from);
    const targetPiece = getPieceAtPosition(to);
    if (!piece) return;

    let captured = false;

    pieces.forEach((p) => {
      p.canMove = board.turn !== p.color;
      if (p.x === to[0] && p.y === to[1]) {
        if (!p.isAlive) return;
        p.isAlive = false;
        captured = true;
      } else if (p.x === from[0] && p.y === from[1]) {
        p.x = to[0];
        p.y = to[1];
      }
    });

    let moveLog: MoveLog = {
      actions: []
    };

    if (captured && targetPiece)
      moveLog.actions.push({
        id: targetPiece.id,
        at: { x: to[0], y: to[1] }
      } as TakeAction);

    moveLog.actions.push({
      id: piece.id,
      from: { x: from[0], y: from[1] },
      to: { x: to[0], y: to[1] }
    } as MoveAction);

    board.turn === PieceColor.White
      ? (board.turn = PieceColor.Black)
      : (board.turn = PieceColor.White);
    setBoard(board);

    doMove(moveLog);
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      onGrabEnd(0, 0);
    });
  });

  const doMove = (moveLog: MoveLog) => {
    let moved = false;
    let captured = false;

    moveLog.actions.forEach((action) => {
      const piece = pieces.find((p) => p.id === action.id);
      if (!piece) return;
      if (action instanceof TakeAction) {
        piece.isAlive = false;
        captured = true;
      } else if (action instanceof MoveAction) {
        piece.x = action.to.x;
        piece.y = action.to.y;
        setMovedFrom(action.from);
        setMovedTo(action.to);

        moved = true;
      }
    });
    setPieces([...pieces]);
    chessSound({ moved, captured });
  };

  const undoMove = (moveLog: MoveLog) => {
    let moved = false;

    moveLog.actions.reverse().forEach((action) => {
      const piece = pieces.find((p) => p.id === action.id);
      if (!piece) return;
      if (action instanceof TakeAction) {
        piece.isAlive = true;
      } else if (action instanceof MoveAction) {
        piece.x = action.from.x;
        piece.y = action.from.y;
        moved = true;
      }
    });

    setPieces([...pieces]);
    chessSound({ moved, captured: false });
  };

  const positionsEqual = (pos1: Vector2 | null, pos2: Vector2 | null) => {
    if (pos1 === null || pos2 === null) return false;
    return pos1.x === pos2.x && pos1.y === pos2.y;
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
          {board.board.map((row, rowIndex) => (
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
                      positionsEqual({ x: rowIndex, y: colIndex }, movedFrom) ||
                      positionsEqual({ x: rowIndex, y: colIndex }, movedTo)
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
