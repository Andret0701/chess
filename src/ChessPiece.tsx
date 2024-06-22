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
  const [sizePosition, setSizePosition] = useState<SizePosition | null>(null);

  const handleResize = () => {
    if (tileRef.current) {
      const { width, height, top, left } =
        tileRef.current.getBoundingClientRect();
      setSizePosition({ width, height, top, left });
    }
    console.log("sizePosition", sizePosition);
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

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    // Make the piece snap to the cursor on drag start if necessary
    const dif = { x: data.x - mousePosition.x, y: data.y - mousePosition.y };

    setPosition({ x: position.x + dif.x, y: position.y + dif.y });
    setMouseDown(true);
  };

  const handleDragEnd = () => {
    // Optional: You can add snapping logic here if necessary
    console.log("Piece dropped at:", position);
    setMouseDown(false);
    //    setPosition({ x: mousePosition.x, y: mousePosition.y });
  };

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
    // <Draggable
    //   position={position}
    //   onDrag={handleDrag}
    //   onStart={handleDragStart}
    //   onStop={handleDragEnd}
    //   //set style not to be selected
    //   // Add any necessary props for snapping behavior
    // >
    <div
      style={{
        width: sizePosition.width,
        height: sizePosition.height,
        top: sizePosition.top,
        left: sizePosition.left,
        userSelect: "none",
        zIndex: isHovering && mouseDown ? 100 : 0,
        position: "absolute",
        transition: "all 0.3s"
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
      />
    </div>
    // </Draggable>
  );
};

export default ChessPiece;
