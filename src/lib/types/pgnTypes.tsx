/**
 * Chess Types
 *
 * Used in loadPgn, usePosition, useEngine, etc.
 */

import { Square, Chess } from "chess.js";

export type Arrows = Array<[Square, Square, string]>;
export interface Variation {
    id: number;
    start: string;
    moves: Array<Move>;
    parentVariation: Variation | null;
    parentMove: number;
}
export interface Move {
    moveNumber: number;
    color: string;
    move: string;
    annotation: string;
    comment: string;
    variation: Variation | null;
    arrows: Arrows;
    fullMatch: string;
    fenAfter: string;
}

export interface Position {
    game: Chess;
    position: string;
    flipped: boolean;
    player: string;
    resetPosition: () => void;
    undoMove: () => void;
    makeMove: (arg0: Square, arg1: Square, arg2: string) => boolean;
    setPosition: (arg0: string) => void;
    toggleFlipped: () => void;
}

export interface VariationState {
    fen: () => string;
    firstMove: () => void;
    lastMove: () => void;
    nextMove: () => void;
    prevMove: () => void;
    enterVariation: () => void;
    exitVariation: () => void;
    setGameState: (arg0: PGNStateCallback) => void;
    variation: Variation;
    halfMoveNum: number;
}
export interface GameState {
    variation: Variation;
    halfMoveNum: number;
}
export type PGNStateCallback = (state: GameState) => GameState;

export const startFen =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
