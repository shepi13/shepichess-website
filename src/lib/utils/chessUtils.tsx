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
  /**
   * Check if move is good (can be used for notation styling)
   *
   * @param move - Move to check
   * @returns if move is interesting (!?), great (!), or brilliant (!!)
   */
  return move.annotation?.startsWith("!") || move.annotation.startsWith("+!");
}

export function moveIsMistake(move: Move) {
  /**
   * Check if move is a mistake (can be used for notation styling)
   *
   * @param move - Move to check
   * @returns if move is dubious (?!), a mistake (?), or a blunder (??)
   */
  return move.annotation?.startsWith("?") || move.annotation.startsWith("+?");
}
