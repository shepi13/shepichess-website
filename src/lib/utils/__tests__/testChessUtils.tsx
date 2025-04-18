import { startFen } from "@/lib/types/pgnTypes";

import { getFen, moveIsGreat, moveIsMistake } from "../chessUtils";
import { loadPgn } from "../loadPgn";

describe("Test Chess Utilities", () => {
  const fenAfter = "Find this string!";
  const variation = {
    start: startFen,
    id: 0,
    parentVariation: null,
    parentMove: 0,
    moves: [
      {
        moveNumber: 1,
        color: "w",
        move: "e4",
        annotation: "",
        comment: "",
        variation: null,
        arrows: [],
        fullMatch: "e4",
        fenAfter: fenAfter,
      },
    ],
  };
  test("Starting Fen", () => {
    const fen = getFen(variation, 0);
    expect(fen).toBe(startFen);
  });
  test("Fen at Move", () => {
    const fen = getFen(variation, 1);
    expect(fen).toBe(fenAfter);
  });
  test("Fen integration test", () => {
    const variation = loadPgn("1. e4 e5 2. Nf3", startFen);
    expect(getFen(variation, 3)).toBe(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    );
  });

  test("Move is Great", () => {
    expect(moveIsGreat(variation.moves[0])).toBe(false);
    variation.moves[0].annotation = "+!";
    expect(moveIsGreat(variation.moves[0])).toBe(true);
    variation.moves[0].annotation = "!";
    expect(moveIsGreat(variation.moves[0])).toBe(true);
  });
  test("Move is Mistake", () => {
    expect(moveIsMistake(variation.moves[0])).toBe(false);
    variation.moves[0].annotation = "+?";
    expect(moveIsMistake(variation.moves[0])).toBe(true);
    variation.moves[0].annotation = "??";
    expect(moveIsMistake(variation.moves[0])).toBe(true);
  });
});
