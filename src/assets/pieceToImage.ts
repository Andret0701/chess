import { Piece, PieceColor, PieceType } from "../ChessUtils";


export const pieceToImage = (piece: Piece) => {
  const basePath = `${process.env.PUBLIC_URL}/assets/`;
  const colorPrefix = piece.color === PieceColor.Black ? "b" : "w";
  const typeMap = {
    [PieceType.Pawn]: "p",
    [PieceType.Rook]: "r",
    [PieceType.Knight]: "n",
    [PieceType.Bishop]: "b",
    [PieceType.Queen]: "q",
    [PieceType.King]: "k"
  };

  return piece.type !== PieceType.Empty
    ? `${basePath}${colorPrefix}${typeMap[piece.type]}.png`
    : "";
};