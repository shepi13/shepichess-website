/**
 * Chess Types
 *
 * Used in loadPgn, usePosition, useEngine, etc.
 */
import { Chess, Square } from "chess.js";

/** Array of arrows for react-chessboard */
export type Arrows = Array<[Square, Square, string]>;

/** PGN Variations and Metadata */
export type PGNData = {
  gameTree: Variation;
  headers: Map<string, string>;
};

/** Tree of nested variations */
export type Variation = {
  id: number;
  start: string;
  moves: Array<Move>;
  parentVariation: Variation | null;
  parentMove: number;
};

/** Move Data (including nested variations) */
export type Move = {
  moveNumber: number;
  color: string;
  move: string;
  annotation: string;
  comment: string;
  variations: Array<Variation>;
  arrows: Arrows;
  fenAfter: string;
};

/** Position and related methods (returned by UsePosition hook) */
export type Position = {
  game: Chess;
  position: string;
  flipped: boolean;
  player: string;
  start: string;
  resetPosition: () => void;
  undoMove: () => void;
  makeMove: (arg0: Square, arg1: Square, arg2: string) => boolean;
  setPosition: (arg0: string) => void;
  toggleFlipped: () => void;
};

/** Location within variation */
export type GameState = {
  variation: Variation;
  halfMoveNum: number;
};
/** Callback to update GameState */
export type PGNStateCallback = (state: GameState) => GameState;

/** Fen for chess starting position */
export const startFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
