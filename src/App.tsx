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
  const handleClick = () => {
    console.log("Button clicked");
  };

  const [newGame, setNewGame] = useState<boolean>(false);

  return (
    <div className="App">
      <ChessBoard newGame={newGame} />
      <div className="ButtonContainer">
        <Button style={buttonStyle} variant="contained" onClick={handleClick}>
          {"<"}
        </Button>
        <Button style={buttonStyle} variant="contained" onClick={handleClick}>
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
