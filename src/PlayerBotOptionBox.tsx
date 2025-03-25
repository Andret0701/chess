import React, { useState } from "react";
import Button from "@mui/material/Button";
import { PieceColor, PieceType } from "./ChessUtils";
import { pieceToImage } from "./ChessPiece";
import { Image } from "react-bootstrap";

type PlayerBotOptionBoxProps = {
  color: PieceColor;
};

const PlayerBotOptionBox: React.FC<PlayerBotOptionBoxProps> = ({ color }) => {
  const [isBot, setBot] = useState(color == PieceColor.Black);

  return (
    <div>
      <Image
        draggable={false}
        src={
          color == PieceColor.White
            ? `${process.env.PUBLIC_URL}/assets/wk.png`
            : `${process.env.PUBLIC_URL}/assets/bk.png`
        }
        style={{
          width: "10vh",
          height: "10vh",
          margin: "0px",
          padding: "0px",
          //move down a bit
          transform:
            "translateY(3vh) " +
            (isBot ? "translateX(5vh)" : "translateX(-5vh)"),
          rotate: isBot ? "-3deg" : "3deg",
          //draw on top of buttons
          zIndex: 100000000000000000000000000000,

          transition: "0.2s"
        }}
      />
      <div>
        <Button
          style={{
            backgroundColor: "#262522",
            scale: !isBot ? "1" : "0.9",
            transition: "0.2s",
            margin: "5px",
            marginTop: "0px",
            paddingTop: "0px",
            borderRadius: "5px",
            overflow: "hidden",
            width: "12vh",
            height: "12vh"
          }}
          disabled={!isBot}
          onClick={() => setBot(false)}
        >
          <Image
            src={
              color == PieceColor.White
                ? `${process.env.PUBLIC_URL}/assets/human1.svg`
                : `${process.env.PUBLIC_URL}/assets/human2.svg`
            }
            style={{
              filter: !isBot ? "none" : "brightness(60%)",
              width: "10vh",
              height: "10vh"
            }}
          />
        </Button>

        <Button
          style={{
            backgroundColor: "#262522",
            scale: isBot ? "1" : "0.9",
            transition: "0.2s",
            margin: "5px",
            borderRadius: "5px",
            overflow: "hidden",
            width: "12vh",
            height: "12vh"
          }}
          disabled={isBot}
          onClick={() => setBot(true)}
        >
          <Image
            src={`${process.env.PUBLIC_URL}/assets/bot.svg`}
            style={{
              filter: isBot ? "none" : "brightness(60%)",
              width: "10vh",
              height: "10vh"
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default PlayerBotOptionBox;
