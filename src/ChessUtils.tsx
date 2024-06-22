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
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export const fenToBoard = (fen: string): Piece[][] => {
  const rows = fen.split("/");
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
          boardRow.push({ type: PieceType.Empty, color: PieceColor.Black });
        }
      }
    }
    board.push(boardRow);
  }
  return board;
};
