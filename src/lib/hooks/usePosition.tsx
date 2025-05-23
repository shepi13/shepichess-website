import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";

import { Position, startFen } from "@/lib/types/pgnTypes";

import { useAudio } from "./useAudio";

/**
 *
 * @param initialPosition - Fen of starting position
 * @param initialOrientation - whether the board is flipped (false -> white's perspective)
 * @returns - Position object with state/methods to make/undo moves or flip the board
 */
export function usePosition(
  initialPosition: string = startFen,
  initialOrientation: boolean = false,
  audioSrc: string = "",
): Position {
  // Track Position State using chess.js Chess object and fen.
  const game = useMemo(() => new Chess(initialPosition), [initialPosition]);

  const [position, setPosition] = useState(initialPosition);
  const [flipped, setFlipped] = useState(initialOrientation);

  // Reset when initial position is changed:
  useEffect(() => setPosition(initialPosition), [initialPosition]);

  // Sound
  const moveSound = useAudio(audioSrc);

  const resetPosition = () => {
    game.load(initialPosition);
    setPosition(game.fen());
  };
  const undoMove = () => {
    game.undo();
    setPosition(game.fen());
  };
  const makeMove = (start: Square, end: Square, piece: string) => {
    // Confirm move is legal
    try {
      game.move({
        from: start,
        to: end,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    // Set position and play audio if successful
    setPosition(game.fen());
    if (moveSound) {
      moveSound.currentTime = 0;
      moveSound.play();
    }
    return true;
  };
  const publicSetPosition = (newPosition: string) => {
    game.load(newPosition);
    setPosition(game.fen());
  };
  const toggleFlipped = () => {
    setFlipped((prev) => !prev);
  };

  return {
    start: initialPosition,
    game,
    position,
    flipped,
    player: initialOrientation ? "b" : "w",
    resetPosition,
    undoMove,
    makeMove,
    setPosition: publicSetPosition,
    toggleFlipped,
  };
}
