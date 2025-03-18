import React from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import PlayerBotOptionBox from "./PlayerBotOptionBox";
import { PieceColor } from "./ChessUtils";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000 // Ensure it is on top of other elements
  },
  content: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center"
  },
  closeButton: {
    marginTop: "20px"
  }
};

type BeginGameMenuProps = {
  onBegin?: () => void;
};

const BeginGameMenu = ({ onBegin }: BeginGameMenuProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it is on top of other elements
        gap: "10vh"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "10vw"
        }}
      >
        <PlayerBotOptionBox color={PieceColor.White} />
        <PlayerBotOptionBox color={PieceColor.Black} />
      </div>

      <Button
        onClick={onBegin}
        style={{
          color: "white",
          backgroundColor: "#7ab555",
          borderBottom: "5px solid #3d7440",
          borderRadius: "6px",
          //borderColor: "#3d7440",
          fontWeight: "bold",
          fontSize: "150%",
          width: "25vh",
          height: "7vh"
        }}
      >
        Begin
      </Button>
    </div>
  );
};

export default BeginGameMenu;
