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
import MoveLogs, {
  Action,
  ActionType,
  MoveAction,
  MoveLog,
  MovedUIAction,
  TakeAction
} from "./MoveLog";
import chessSound from "./ChessSound";
import { Portal } from "@mui/material";

interface ChessBoardProps {
  newGame?: boolean;
  nextMove?: boolean;
  previousMove?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const [board, setBoard] = useState(fenToBoard(FEN_STARTING_POSITION));

  const newGame = () => {
    setBoard(fenToBoard(FEN_STARTING_POSITION));
    setMoveLogs(new MoveLogs());
    setMovedFrom({ x: -1, y: -1 });
    setMovedTo({ x: -1, y: -1 });
  };

  const nextMove = () => {
    const move = moveLogs.nextLog();
    if (!move) return;
    board.turn =
      board.turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
    setBoard(board);
    doMove(move);
  };

  const previousMove = () => {
    const move = moveLogs.previousLog();
    if (!move) return;
    board.turn =
      board.turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
    undoMove(move);
  };

  useEffect(() => {
    pieces.forEach((p) => {
      p.canMove = board.turn === p.color;
    });
    setPieces([...pieces]);
  }, [board.turn]);

  useEffect(() => {
    if (!props.newGame) return;
    newGame();
  }, [props.newGame]);

  useEffect(() => {
    if (!props.nextMove) return;
    nextMove();
  }, [props.nextMove]);

  useEffect(() => {
    if (!props.previousMove) return;
    previousMove();
  }, [props.previousMove]);

  const [pieces, setPieces] = useState<PieceData[]>([]);
  const [draggingPosition, setDraggingPosition] = useState<
    [number, number] | null
  >(null);
  const [movedFrom, setMovedFrom] = useState<Vector2>({ x: -1, y: -1 });
  const [movedTo, setMovedTo] = useState<Vector2>({ x: -1, y: -1 });
  const [whitePromotion, setWhitePromotion] = useState<MoveLog | null>(null);
  const [blackPromotion, setBlackPromotion] = useState<MoveLog | null>(null);
  const [promotionPosition, setPromotionPosition] = useState<Vector2 | null>();

  const [moveLogs, setMoveLogs] = useState<MoveLogs>(new MoveLogs());

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

  const beginPromotion = (at: Vector2, color: PieceColor, moveLog: MoveLog) => {
    pieces.forEach((p) => {
      p.canMove = false;
    });
    setPieces([...pieces]);
    if (color === PieceColor.White) setWhitePromotion(moveLog);
    if (color === PieceColor.Black) setBlackPromotion(moveLog);
    setPromotionPosition(at);
  };

  const endPromotion = (piece: PieceType, color: PieceColor) => {
    if (piece === PieceType.Empty) {
      if (color === PieceColor.White) {
        if (whitePromotion) undoMove(whitePromotion);
        setWhitePromotion(null);
      }
      if (color === PieceColor.Black) {
        if (blackPromotion) undoMove(blackPromotion);
        setBlackPromotion(null);
      }

      pieces.forEach((p) => {
        p.canMove = board.turn === p.color;
      });
      setPieces([...pieces]);
      return;
    }

    let moveLog: MoveLog | null = null;

    if (color === PieceColor.White) moveLog = whitePromotion;
    if (color === PieceColor.Black) moveLog = blackPromotion;

    if (
      !moveLog ||
      promotionPosition === null ||
      promotionPosition === undefined
    )
      return;

    if (color === PieceColor.White) setWhitePromotion(null);
    if (color === PieceColor.Black) setBlackPromotion(null);

    let id = "";
    pieces.forEach((p) => {
      if (
        positionsEqual({ x: p.x, y: p.y }, promotionPosition) &&
        p.color === color &&
        p.isAlive
      ) {
        p.type = piece;
        id = p.id;
      }
      p.canMove = board.turn !== p.color;
    });
    setPieces([...pieces]);

    moveLog.actions.push({
      type: ActionType.Transform,
      id: id,
      transformFrom: PieceType.Pawn,
      transformTo: piece
    });

    moveLogs.addLog(moveLog);
    setMoveLogs(moveLogs);

    board.turn === PieceColor.White
      ? (board.turn = PieceColor.Black)
      : (board.turn = PieceColor.White);
    setBoard(board);
  };

  useEffect(() => {
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
        type: ActionType.Take,
        at: { x: to[0], y: to[1] }
      } as TakeAction);

    moveLog.actions.push({
      id: piece.id,
      type: ActionType.Move,
      from: { x: from[0], y: from[1] },
      to: { x: to[0], y: to[1] }
    } as MoveAction);

    moveLog.actions.push({
      id: piece.id,
      type: ActionType.MovedUI,
      fromFrom: { x: movedFrom.x, y: movedFrom.y },
      fromTo: { x: movedTo.x, y: movedTo.y },
      toFrom: { x: from[0], y: from[1] },
      toTo: { x: to[0], y: to[1] }
    } as MovedUIAction);

    doMove(moveLog);
    if (piece.type === PieceType.Pawn) {
      if (piece.color === PieceColor.White && to[0] === 0) {
        beginPromotion({ x: to[0], y: to[1] }, PieceColor.White, moveLog);
        return;
      } else if (piece.color === PieceColor.Black && to[0] === 7) {
        beginPromotion({ x: to[0], y: to[1] }, PieceColor.Black, moveLog);
        return;
      }
    }

    board.turn === PieceColor.White
      ? (board.turn = PieceColor.Black)
      : (board.turn = PieceColor.White);
    setBoard(board);
    moveLogs.addLog(moveLog);
    setMoveLogs(moveLogs);
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
      if (action.type === ActionType.Take) {
        piece.isAlive = false;
        captured = true;
      } else if (action.type === ActionType.Move) {
        piece.x = action.to.x;
        piece.y = action.to.y;
        moved = true;
      } else if (action.type === ActionType.MovedUI) {
        setMovedFrom(action.toFrom);
        setMovedTo(action.toTo);
      } else if (action.type === ActionType.Transform) {
        piece.type = action.transformTo;
      }
    });
    setPieces([...pieces]);
    chessSound({ moved, captured });
  };

  const undoMove = (moveLog: MoveLog) => {
    let moved = false;

    moveLog.actions.reverse().forEach((action: Action) => {
      const piece = pieces.find((p) => p.id === action.id);
      if (!piece) return;

      if (action.type === ActionType.Take) {
        piece.isAlive = true;
      } else if (action.type === ActionType.Move) {
        piece.x = action.from.x;
        piece.y = action.from.y;
        moved = true;
      } else if (action.type === ActionType.MovedUI) {
        setMovedFrom(action.fromFrom);
        setMovedTo(action.fromTo);
      } else if (action.type === ActionType.Transform) {
        piece.type = action.transformFrom;
      }
    });

    setPieces(pieces);
    chessSound({ moved, captured: false });
  };

  const positionsEqual = (
    pos1: Vector2 | null | undefined,
    pos2: Vector2 | null | undefined
  ) => {
    if (pos1 === null || pos2 === null) return false;
    if (pos1 === undefined || pos2 === undefined) return false;
    return pos1.x === pos2.x && pos1.y === pos2.y;
  };

  if (tileRefs.length === 0) return null;

  return (
    <>
      <div className="ChessBoardContainer">
        <PromotionBox
          onPromotionSelected={endPromotion}
          color={PieceColor.White}
          active={whitePromotion !== null}
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
                    boxSizing: "border-box",
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
          onPromotionSelected={endPromotion}
          color={PieceColor.Black}
          active={blackPromotion !== null}
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
