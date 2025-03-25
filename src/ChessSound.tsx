import React from "react";

function chessSound({
  moved,
  captured
}: {
  moved: boolean;
  captured: boolean;
}) {
  if (captured) {
    playSound(`${process.env.PUBLIC_URL}/assets/capture.wav`);
    return;
  }
  if (moved) {
    playSound(`${process.env.PUBLIC_URL}/assets/move.wav`);
    return;
  }
}

function playSound(path: string) {
  const audio = new Audio(path);
  audio.play();
}

export default chessSound;
