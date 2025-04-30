import { Chess } from "chess.js";

import { Move, Variation } from "../types/pgnTypes";

/**
 * Returns the fen for a variation after a specific move number (1 indexed)
 *
 * @param variation - variation to search
 * @param moveNumber - half move count (relative to variation start)
 */
export function getFen(variation: Variation, moveNumber: number) {
  if (moveNumber === 0) {
    return variation.start;
  }
  return variation.moves[moveNumber - 1].fenAfter;
}

/**
 * Check if move is good (can be used for notation styling)
 *
 * @param move - Move to check
 * @returns if move is interesting (!?), great (!), or brilliant (!!)
 */
export function moveIsGreat(move: Move) {
  return move.annotation?.startsWith("!") || move.annotation.startsWith("+!");
}

/**
 * Check if move is a mistake (can be used for notation styling)
 *
 * @param move - Move to check
 * @returns if move is dubious (?!), a mistake (?), or a blunder (??)
 */
export function moveIsMistake(move: Move) {
  return move.annotation?.startsWith("?") || move.annotation.startsWith("+?");
}

/**
 * Returns side to move of a fen string
 *
 * @param fen - current position
 *
 * @returns "w" | "b"
 */
export function sideToMove(fen: string) {
  return new Chess(fen).turn();
}

/**
 * Converts subvariations to be nested instead of flat.
 *
 * For example, 1. e4 e5 (1...c5) (1...e6) becomes 1. e4 e5 (1...c5 (1...e6))
 *
 * @param variation - root variation
 *
 * @returns - new variation object with subvariations nested when possible
 */
export function makeVariationsNested(
  variation: Variation,
  additionalVariations: Array<Variation> = [],
): Variation {
  // Return variation if it has no moves
  if (!variation.moves.length) {
    return { ...variation };
  }
  // Add first move, along with any additional variations
  const firstMove = { ...variation.moves[0] };
  const moveVars = firstMove.variations.concat(additionalVariations);
  if (moveVars.length) {
    firstMove.variations = [
      makeVariationsNested(moveVars[0], moveVars.slice(1)),
    ];
  }

  // Add additional moves, recursing if they have variation.
  const moves: Array<Move> = [firstMove];
  for (const move of variation.moves.slice(1)) {
    if (move.variations.length > 0) {
      move.variations = [
        makeVariationsNested(move.variations[0], move.variations.slice(1)),
      ];
    }
    moves.push({ ...move });
  }

  return { ...variation, moves: moves };
}
