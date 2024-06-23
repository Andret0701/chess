import React, { useState } from "react";
import "./App.css";
import ChessBoard from "./ChessBoard";
import Button from "@mui/material/Button";

function App() {
  const buttonStyle = {
    //     background-color: #262522;
    // color: white;
    // /* Optionally, set text color */
    // margin: 5px;
    // font-weight: bold;
    // // Add more styles as needed
    backgroundColor: "#262522",
    color: "white",
    margin: "5px",
    //add margin on top
    top: "10px",
    fontWeight: "bold",
    fontSize: "100%"
  };

  const [newGame, setNewGame] = useState<boolean>(false);
  const [nextMove, setNextMove] = useState<boolean>(false);
  const [previousMove, setPreviousMove] = useState<boolean>(false);

  return (
    <div className="App">
      <ChessBoard
        newGame={newGame}
        nextMove={nextMove}
        previousMove={previousMove}
      />
      <div className="ButtonContainer">
        <Button
          style={buttonStyle}
          variant="contained"
          onClick={() => {
            setPreviousMove(true);
            setTimeout(() => {
              setPreviousMove(false);
            }, 10);
          }}
        >
          {"<"}
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          onClick={() => {
            setNextMove(true);
            setTimeout(() => {
              setNextMove(false);
            }, 10);
          }}
        >
          {">"}
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          onClick={() => {
            setNewGame(true);
            setTimeout(() => {
              setNewGame(false);
            }, 10);
          }}
        >
          {"+"}
        </Button>
      </div>
    </div>
  );
}

export default App;
