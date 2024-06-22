import React, { useState, useEffect, useRef } from "react";
import { Piece, PieceColor, PieceType } from "./ChessUtils"; // Adjust path if necessary
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Image } from "react-bootstrap";

const pieceToImage = (piece: Piece) => {
  let path = "./assets/";

  switch (piece.color) {
    case PieceColor.Black:
      path += "b";
      break;
    case PieceColor.White:
      path += "w";
      break;
    default:
      break;
  }

  switch (piece.type) {
    case PieceType.Pawn:
      path += "p";
      break;
    case PieceType.Rook:
      path += "r";
      break;
    case PieceType.Knight:
      path += "n";
      break;
    case PieceType.Bishop:
      path += "b";
      break;
    case PieceType.Queen:
      path += "q";
      break;
    case PieceType.King:
      path += "k";
      break;
    case PieceType.Empty:
      path = ""; // Handle empty piece type if needed
      break;
    default:
      break;
  }

  path += ".png";

  return path; // Return the constructed path based on piece's color and type
};

interface PieceProps {
  color: PieceColor;
  type: PieceType;
  tileRef: React.RefObject<HTMLDivElement>;
}

interface SizePosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

const ChessPiece: React.FC<PieceProps> = ({
  color,
  type,
  tileRef
}: PieceProps) => {
  const [isHovering, setHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [sizePosition, setSizePosition] = useState<SizePosition>();

  const handleResize = () => {
    if (tileRef.current) {
      const { width, height, top, left } =
        tileRef.current.getBoundingClientRect();
      setSizePosition({ width, height, top, left });
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [tileRef]);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!sizePosition) return null;

  return (
    <div
      style={{
        width: sizePosition.width,
        height: sizePosition.height,
        left: mouseDown
          ? mousePosition.x - sizePosition.width / 2
          : sizePosition.left,
        top: mouseDown
          ? mousePosition.y - sizePosition.height / 2
          : sizePosition.top,
        userSelect: "none",
        zIndex: isHovering && mouseDown ? 100 : 0,
        position: "absolute",
        transition: "all 0.06s"
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
          transition: "transform 0.06s",
          transformOrigin: "center",
          cursor: isHovering ? "grab" : "pointer",
          userSelect: "none",
          transform: isHovering
            ? mouseDown
              ? "scale(1.1) rotate(-4deg)"
              : "scale(1.05) rotate(1deg)"
            : "scale(1) rotate(0deg)",
          zIndex: isHovering && mouseDown ? 100 : 0
        }}
        src={pieceToImage({ color, type })}
        alt={`${color} ${type}`}
        draggable={false}
        onMouseEnter={() => {
          if (!mouseDown) setHovering(true);
        }}
        onMouseLeave={() => {
          if (!mouseDown) setHovering(false);
        }}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
      />
    </div>
  );
};

export default ChessPiece;
