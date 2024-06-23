export enum PieceType {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  Empty
}

export enum PieceColor {
  Black,
  White
}

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export const FEN_STARTING_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Board {
  board: Piece[][];
  enPassantTarget: Vector2 | null;
  whiteKingMoved: boolean;
  blackKingMoved: boolean;
  whiteKingRookMoved: boolean;
  whiteQueenRookMoved: boolean;
  blackKingRookMoved: boolean;
  blackQueenRookMoved: boolean;
  turn: PieceColor;
  halfMoveClock: number;
  fullMoveNumber: number;
}
export const fenToBoard = (fen: string): Board => {
  const parts = fen.split(" ");
  const rows = parts[0].split("/");
  const board: Piece[][] = [];
  for (const row of rows) {
    const boardRow: Piece[] = [];
    for (const char of row) {
      if (char === "r") {
        boardRow.push({ type: PieceType.Rook, color: PieceColor.Black });
      } else if (char === "n") {
        boardRow.push({ type: PieceType.Knight, color: PieceColor.Black });
      } else if (char === "b") {
        boardRow.push({ type: PieceType.Bishop, color: PieceColor.Black });
      } else if (char === "q") {
        boardRow.push({ type: PieceType.Queen, color: PieceColor.Black });
      } else if (char === "k") {
        boardRow.push({ type: PieceType.King, color: PieceColor.Black });
      } else if (char === "p") {
        boardRow.push({ type: PieceType.Pawn, color: PieceColor.Black });
      } else if (char === "R") {
        boardRow.push({ type: PieceType.Rook, color: PieceColor.White });
      } else if (char === "N") {
        boardRow.push({ type: PieceType.Knight, color: PieceColor.White });
      } else if (char === "B") {
        boardRow.push({ type: PieceType.Bishop, color: PieceColor.White });
      } else if (char === "Q") {
        boardRow.push({ type: PieceType.Queen, color: PieceColor.White });
      } else if (char === "K") {
        boardRow.push({ type: PieceType.King, color: PieceColor.White });
      } else if (char === "P") {
        boardRow.push({ type: PieceType.Pawn, color: PieceColor.White });
      } else {
        const numSpaces = parseInt(char, 10);
        for (let i = 0; i < numSpaces; i++) {
          boardRow.push({ type: PieceType.Empty, color: PieceColor.White });
        }
      }
    }
    board.push(boardRow);
  }

  const enPassantTarget =
    parts[3] !== "-"
      ? {
          x: parts[3].charCodeAt(0) - "a".charCodeAt(0),
          y: parseInt(parts[3][1], 10) - 1
        }
      : null;

  return {
    board: board,
    enPassantTarget: enPassantTarget,
    whiteKingMoved: !parts[2].includes("K"),
    blackKingMoved: !parts[2].includes("k"),
    whiteKingRookMoved: !parts[2].includes("K"),
    whiteQueenRookMoved: !parts[2].includes("Q"),
    blackKingRookMoved: !parts[2].includes("k"),
    blackQueenRookMoved: !parts[2].includes("q"),
    turn: parts[1] === "w" ? PieceColor.White : PieceColor.Black,
    halfMoveClock: parseInt(parts[4], 10),
    fullMoveNumber: parseInt(parts[5], 10)
  };
};

export const boardToFen = (board: Board): string => {
  let fen = "";
  for (const row of board.board) {
    let emptyCount = 0;
    for (const piece of row) {
      if (piece.type === PieceType.Empty) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        switch (piece.type) {
          case PieceType.Pawn:
            fen += piece.color === PieceColor.White ? "P" : "p";
            break;
          case PieceType.Knight:
            fen += piece.color === PieceColor.White ? "N" : "n";
            break;
          case PieceType.Bishop:
            fen += piece.color === PieceColor.White ? "B" : "b";
            break;
          case PieceType.Rook:
            fen += piece.color === PieceColor.White ? "R" : "r";
            break;
          case PieceType.Queen:
            fen += piece.color === PieceColor.White ? "Q" : "q";
            break;
          case PieceType.King:
            fen += piece.color === PieceColor.White ? "K" : "k";
            break;
        }
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    fen += "/";
  }
  fen = fen.slice(0, -1); // Remove the last '/'

  fen += " ";
  fen += board.turn === PieceColor.White ? "w" : "b";
  fen += " ";

  let castlingRights = "";
  if (!board.whiteKingMoved && !board.whiteKingRookMoved) castlingRights += "K";
  if (!board.whiteKingMoved && !board.whiteQueenRookMoved)
    castlingRights += "Q";
  if (!board.blackKingMoved && !board.blackKingRookMoved) castlingRights += "k";
  if (!board.blackKingMoved && !board.blackQueenRookMoved)
    castlingRights += "q";
  fen += castlingRights || "-";

  fen += " ";
  fen += board.enPassantTarget
    ? String.fromCharCode("a".charCodeAt(0) + board.enPassantTarget.x) +
      (board.enPassantTarget.y + 1)
    : "-";
  fen += " ";
  fen += board.halfMoveClock;
  fen += " ";
  fen += board.fullMoveNumber;

  return fen;
};
