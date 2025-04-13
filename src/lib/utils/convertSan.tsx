import { Chess } from "chess.js";

/**
 * Converts a string of chess moves to standard algebraeic notation.
 * E.G. "1. e2e4 e7e5 g1f3" -> "1. e4 e5 2. Nf3"
 *
 * Optionally strips variation down to a specified length.
 *
 * @param initialFen - fen of starting position
 * @param moves - Text for moves/variation to convert
 * @param maxLength - Max length of variation to return (in half moves). Strips extra moves.
 *
 * @returns String of variation in SAN (standard algebraeic notation)
 */
export function convertVariationToSan(
  initialFen: string,
  moves: string,
  maxLength = -1,
) {
  const game = new Chess(initialFen);
  let result = "";
  if (game.turn() == "b") {
    result += game.moveNumber() + "... ";
  }
  for (const move of moves.split(" ")) {
    // Ignore move numbers
    if (/^\d/.test(move)) {
      continue;
    }
    // Make move to check legality
    game.move(move);

    // Add to string with move number
    if (game.turn() == "b") {
      result += game.moveNumber() + ". ";
    }
    result += game.history().pop() + " ";

    // Strip extra moves from result string
    if (maxLength > 0 && game.history().length >= maxLength) {
      break;
    }
  }
  return result.trim();
}
