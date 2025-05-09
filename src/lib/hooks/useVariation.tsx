import { useState } from "react";

import { PGNStateCallback, Variation } from "@/lib/types/pgnTypes";
import { getFen } from "@/lib/utils/chessUtils";

import { useAudio } from "./useAudio";

/**
 * Variation location and methods (returned by useVariation hook)
 *
 * @property fen - Function that returns fen of current position
 *
 * Move traversal functions (return success (boolean)):
 * @property firstMove
 * @property lastMove,
 * @property nextMove,
 * @property prevMove,
 *
 * Variation traversal functions (return success (boolean)):
 * @property enterVariation,
 * @property exitVariation,
 *
 * // Function to set current gamestate safely using a callback (e.g. SetGameState((prev) => {...prev, halfMoveNum: 5}))
 * @property setGameState (() => boolean)
 *
 * // Game State
 * @property variation - current variation
 * @property halfMoveNum - current move location
 * }
 */
export type VariationState = {
  fen: () => string;
  firstMove: () => boolean;
  lastMove: () => boolean;
  nextMove: () => boolean;
  prevMove: () => boolean;
  enterVariation: () => boolean;
  exitVariation: () => boolean;
  setGameState: (arg0: PGNStateCallback) => boolean;
  variation: Variation;
  halfMoveNum: number;
};

/**
 * React Custom Hook to track current location within a tree of variations
 *
 * @param variation - Main variation of the tree
 * @returns - Variation state with functions to traverse the current tree
 */
export function useVariation(
  variation: Variation,
  audioSrc: string = "",
): VariationState {
  const [gameState, setGameState] = useState({
    variation,
    halfMoveNum: 0,
  });
  const moveSound = useAudio(audioSrc);

  // Use setGameState, but guarantee that result is a valid location of the move tree
  function setGameStateSafe(callback: PGNStateCallback): boolean {
    const newState = callback(gameState);
    const success = (
      newState.variation &&
      newState.halfMoveNum >= 0 &&
      newState.halfMoveNum <= newState.variation.moves.length &&
      newState != gameState
    );
    if(success) {
      setGameState((prevState) => callback(prevState));
    }
    return success;
  }

  // Finds and enters the next variation in the move tree, playing the move with sound
  function enterVariation() {
    return setGameStateSafe((prevState) => {
      const moves = prevState.variation.moves;
      const startIndex = Math.max(prevState.halfMoveNum - 1, 0);
      /* Find next variation if exists */
      for (let moveNum = startIndex; moveNum < moves.length; moveNum++) {
        if (moves[moveNum].variations.length > 0) {
          const variation = moves[moveNum].variations[0];
          return { variation, halfMoveNum: 1 };
        }
      }
      return prevState;
    });
  }

  // Exits the current variation and enters its parent.
  function exitVariation() {
    return setGameStateSafe((prev) => {
      return {
        variation: prev.variation.parentVariation || variation,
        halfMoveNum: prev.variation.parentMove,
      };
    });
  }

  // Adds a move sound to a method
  function addSound(handler: () => boolean) {
    return () => {
      if (!moveSound) return handler();
      if (moveSound.paused && handler()) {
        moveSound.currentTime = 0;
        moveSound.play();
        return true;
      }
      return false;
    };
  }

  return {
    fen: () => getFen(gameState.variation, gameState.halfMoveNum),
    // firstMove and lastMove also jump to main variation
    firstMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        variation,
        halfMoveNum: 0,
      })),
    lastMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        variation,
        halfMoveNum: variation.moves.length,
      })),
    // prevMove/nextMove only set move number
    nextMove: addSound(() =>
      setGameStateSafe((prev) => ({
        ...prev,
        halfMoveNum: prev.halfMoveNum + 1,
      })),
    ),
    prevMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        halfMoveNum: prev.halfMoveNum - 1,
      })),
    enterVariation: addSound(enterVariation),
    exitVariation,
    setGameState: setGameStateSafe,
    ...gameState,
  };
}
