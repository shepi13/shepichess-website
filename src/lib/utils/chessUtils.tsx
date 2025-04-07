import { Move, Variation } from "../types/pgnTypes";

export function getFen(variation: Variation, moveNumber: number) {
  /**
   * Returns the fen for a variation after a specific move number (1 indexed)
   *
   * @param variation - variation to search
   * @param moveNumber - half move count (relative to variation start)
   */
  if (moveNumber === 0) {
    return variation.start;
  }
  return variation.moves[moveNumber - 1].fenAfter;
}

export function moveIsGreat(move: Move) {
    return move.annotation?.startsWith("!") || move.annotation.startsWith("+!");
}

export function moveIsMistake(move: Move) {
    return move.annotation?.startsWith("?") || move.annotation.startsWith("+?");
}