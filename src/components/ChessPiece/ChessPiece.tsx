import React, { useState, useEffect, useRef, useCallback } from "react";
import { Piece, PieceColor, PieceType } from "../../ChessUtils"; // Adjust path if necessary
import { Image } from "react-bootstrap";
import { throttle } from "lodash";
import { pieceToImage } from "../../assets/pieceToImage";
import { useMousePosition } from "../../hooks/useMousePosition";
import { useSizePosition } from "../../hooks/useSizePosition";

export interface PieceData {
  id: string;
  color: PieceColor;
  type: PieceType;
  isAlive: boolean;
  isDragging: boolean;
  x: number;
  y: number;
  canMove: boolean;
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
  const mousePosition = useMousePosition();
  const sizePosition = useSizePosition(tileRef);

  useEffect(() => {
    if (!piece.isAlive || !piece.canMove) setHovering(false);
  }, [piece.isAlive, piece.canMove]);

  const startDrag = () => {
    if (!piece.canMove) return;

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
        transition: piece.isDragging ? "all 0.05s" : "all 0.3s",
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
          cursor: isHovering && piece.canMove ? "grab" : "default",
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
        onMouseEnter={() =>
          !piece.isDragging && piece.canMove && setHovering(true)
        }
        onMouseLeave={() =>
          !piece.isDragging && piece.canMove && setHovering(false)
        }
        onMouseDown={startDrag}
      />
    </div>
  );
};

export default ChessPiece;
