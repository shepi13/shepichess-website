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
 *
 */
export function sideToMove(fen: string) {
  return new Chess(fen).turn();
}
