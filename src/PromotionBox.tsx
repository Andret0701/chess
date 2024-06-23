import React from "react";
import Button from "@mui/material/Button";
import { PieceColor, PieceType } from "./ChessUtils";
import { pieceToImage } from "./ChessPiece";
import { Image } from "react-bootstrap";

type PromotionBoxProps = {
  color: PieceColor;
  active: boolean;
  onPromotionSelected: (piece: PieceType, color: PieceColor) => void;
};

const PromotionBox: React.FC<PromotionBoxProps> = ({
  color,
  active,
  onPromotionSelected
}) => {
  const handlePromotionClick = (piece: PieceType) => {
    onPromotionSelected(piece, color);
  };

  const buttonStyle = {
    backgroundColor: "#262522",
    width: "10vh",
    height: "10vh",
    margin: "5px",
    cornerRadius: "5px",
    overflow: "hidden",
    opacity: active ? "1" : "0",
    transition: active ? "all 0.3s" : "all 0.5s"
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    userSelect: "none" as "none",
    margin: "0px",
    padding: "0px",
    pointerEvents: "none" as "none",
    opacity: active ? "1" : "0",
    transition: active ? "all 0.3s" : "all 0.5s"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        height: active ? "100%" : "0",
        maxHeight: active ? "100%" : "0",
        transition: "all 0.5s"
      }}
    >
      <Button
        variant="contained"
        onClick={() => handlePromotionClick(PieceType.Queen)}
        style={buttonStyle}
      >
        <Image
          src={pieceToImage({ type: PieceType.Queen, color: color })}
          style={imageStyle}
        />
      </Button>
      <Button
        variant="contained"
        onClick={() => handlePromotionClick(PieceType.Rook)}
        style={buttonStyle}
      >
        <Image
          src={pieceToImage({ type: PieceType.Rook, color: color })}
          style={imageStyle}
        />
      </Button>
      <Button
        variant="contained"
        onClick={() => handlePromotionClick(PieceType.Bishop)}
        style={buttonStyle}
      >
        <Image
          src={pieceToImage({
            type: PieceType.Bishop,
            color: color
          })}
          style={imageStyle}
        />
      </Button>

      <Button
        variant="contained"
        onClick={() => handlePromotionClick(PieceType.Knight)}
        style={buttonStyle}
      >
        <Image
          src={pieceToImage({
            type: PieceType.Knight,
            color: color
          })}
          style={imageStyle}
        />
      </Button>
      <Button
        variant="contained"
        onClick={() => handlePromotionClick(PieceType.Empty)}
        style={{
          ...buttonStyle,
          textAlign: "center",
          fontSize: "1rem",
          height: "4vh"
        }}
      >
        x
      </Button>
    </div>
  );
};

export default PromotionBox;
