import React, { useState, useEffect, useRef, useCallback } from "react";
import { Piece, PieceColor, PieceType } from "./ChessUtils"; // Adjust path if necessary
import { Image } from "react-bootstrap";
import { throttle } from "lodash";

const pieceToImage = (piece: Piece) => {
  const basePath = "./assets/";
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

export interface PieceData {
  id: string;
  color: PieceColor;
  type: PieceType;
  isAlive: boolean;
  isDragging: boolean;
  x: number;
  y: number;
}

interface PieceProps {
  piece: PieceData;
  tileRef: React.RefObject<HTMLDivElement>;
  onGrabStart?: (x: number, y: number) => void;
}

interface SizePosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

const ChessPiece: React.FC<PieceProps> = ({ piece, tileRef, onGrabStart }) => {
  const [isHovering, setHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sizePosition, setSizePosition] = useState<SizePosition>();

  const handleResize = useCallback(() => {
    if (tileRef.current) {
      const { width, height, top, left } =
        tileRef.current.getBoundingClientRect();
      setSizePosition({ width, height, top, left });
    }
  }, [tileRef]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleResize]);

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, 16), // Adjust the throttle rate as needed
    []
  );

  const startDrag = (e: React.MouseEvent) => {
    if (onGrabStart && piece.isAlive && !piece.isDragging) {
      piece.isDragging = true;
      onGrabStart(piece.x, piece.y);
    }
  };

  if (!sizePosition) return null;

  return (
    <div
      style={{
        width: sizePosition.width,
        height: sizePosition.height,
        left: piece.isDragging
          ? mousePosition.x - sizePosition.width / 2
          : sizePosition.left,
        top: piece.isDragging
          ? mousePosition.y - sizePosition.height / 2
          : sizePosition.top,
        userSelect: "none",
        zIndex: piece.isAlive ? (isHovering && piece.isDragging ? 3 : 2) : 1,
        position: "absolute",
        transition: piece.isDragging ? "none" : "all 0.3s",
        //make it not hitting mouse if not alive
        pointerEvents: "none"
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
          transition: piece.isAlive ? "all 0.06s" : "all 0.6s",
          transformOrigin: "center",
          cursor: isHovering ? "grab" : "pointer",
          userSelect: "none",
          opacity: piece.isAlive ? 1 : 0,
          transform: !piece.isAlive
            ? "scale(0) rotate(40deg)"
            : isHovering
            ? piece.isDragging
              ? "scale(1.1) rotate(-4deg)"
              : "scale(1.05) rotate(1deg)"
            : "scale(1) rotate(0deg)",
          zIndex: piece.isAlive ? (isHovering && piece.isDragging ? 3 : 2) : 1,
          pointerEvents: piece.isAlive && !piece.isDragging ? "auto" : "none"
        }}
        src={pieceToImage({ color: piece.color, type: piece.type })}
        alt={`${piece.color} ${piece.type}`}
        draggable={false}
        onMouseEnter={() => !piece.isDragging && setHovering(true)}
        onMouseLeave={() => !piece.isDragging && setHovering(false)}
        onMouseDown={startDrag}
      />
    </div>
  );
};

export default ChessPiece;
