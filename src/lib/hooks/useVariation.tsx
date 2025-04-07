import { useState } from "react";
import { Variation, VariationState } from "../types/pgnTypes";
import { getFen } from "../utils/chessUtils";
import { PGNStateCallback } from "../types/pgnTypes";

export function useVariation(variation: Variation): VariationState {
  /**
   * React Custom Hook to track current location within a tree of variations
   *
   * @param variation - Main variation of the tree
   * @returns {
   * // Function that returns fen of current position
   *  fen,
   *
   * // Functions to traverse variation tree
   *  firstMove,
   *  lastMove,
   *  nextMove,
   *  prevMove,
   *  enterVariation,
   *  exitVariation,
   *
   * // Function to set current gamestate safely using a callback (e.g. SetGameState((prev) => {...prev, halfMoveNum: 5}))
   *  setGameState,
   * }
   */
  const [gameState, setGameState] = useState({
    variation: variation,
    halfMoveNum: 0,
  });

  // Use setGameState, but guarantee that result is a valid location of the move tree
  function setGameStateSafe(callback: PGNStateCallback) {
    setGameState((prevState) => {
      const newState = callback(prevState);
      if (
        !newState.variation ||
        newState.halfMoveNum < 0 ||
        newState.halfMoveNum > newState.variation.moves.length
      ) {
        return prevState;
      }
      return newState;
    });
  }

  // Finds and enters the next variation in the move tree
  function enterVariation() {
    setGameStateSafe((prevState) => {
      const variationMoves = prevState.variation.moves;
      const initialMoveNum = prevState.halfMoveNum;
      /* Find next variation if exists */
      for (
        let moveNum = Math.max(initialMoveNum - 1, 0);
        moveNum < variationMoves.length;
        moveNum++
      ) {
        const variation = variationMoves[moveNum].variation;
        if (variation) {
          return {
            ...prevState,
            variation: variation,
            halfMoveNum: 1,
          };
        }
      }
      return prevState;
    });
  }

  // Exits the current variation and enters its parent.
  function exitVariation() {
    setGameStateSafe((prev) => {
      return {
        variation: prev.variation.parentVariation || variation,
        halfMoveNum: prev.variation.parentMove,
      };
    });
  }

  return {
    fen: () => getFen(gameState.variation, gameState.halfMoveNum),
    firstMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        variation: variation,
        halfMoveNum: 0,
      })),
    lastMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        variation: variation,
        halfMoveNum: variation.moves.length,
      })),
    nextMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        halfMoveNum: prev.halfMoveNum + 1,
      })),
    prevMove: () =>
      setGameStateSafe((prev) => ({
        ...prev,
        halfMoveNum: prev.halfMoveNum - 1,
      })),
    enterVariation,
    exitVariation,
    setGameState: setGameStateSafe,
    ...gameState,
  };
}
