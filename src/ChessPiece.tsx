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

interface PieceProps {
  color: PieceColor;
  type: PieceType;
  tileRef: React.RefObject<HTMLDivElement>;
  onGrabStart?: () => void;
  onGrabEnd?: () => void;
}

interface SizePosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

const ChessPiece: React.FC<PieceProps> = ({ color, type, tileRef }) => {
  const [isHovering, setHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, 16), // Adjust the throttle rate as needed
    []
  );

  const startDrag = (e: React.MouseEvent) => {
    if (!mouseDown) {
      setMouseDown(true);
      window.addEventListener("mousemove", handleMouseMove);
      handleMouseMove(e.nativeEvent as MouseEvent);
    }
  };

  const endDrag = () => {
    if (mouseDown) {
      setMouseDown(false);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  };

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
        transition: mouseDown ? "none" : "all 0.3s"
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
        onMouseEnter={() => !mouseDown && setHovering(true)}
        onMouseLeave={() => !mouseDown && setHovering(false)}
        onMouseDown={startDrag}
        onMouseUp={endDrag}
      />
    </div>
  );
};

export default ChessPiece;
