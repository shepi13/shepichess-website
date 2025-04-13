import { Chess } from "chess.js";

import { startFen } from "@/lib/types/pgnTypes";

import { convertVariationToSan } from "../convertSan";

describe("Convert San tests", () => {
  test.each([
    ["1. e2e4 e7e5 2. g1f3 g8f6"], // Non-algebraeic/UCI Notation
    ["e4 e5 Nf3 Nf6"], // Normal SAN no move numbers
    ["1. e4 e5 2. Nf3 Nf6"], // Already San
  ])("Converts successfully", (input) => {
    // Check with maxLength
    let output = convertVariationToSan(startFen, input, 3);
    expect(output).toBe("1. e4 e5 2. Nf3");

    // Default Max length / full variation
    output = convertVariationToSan(startFen, input);
    expect(output).toBe("1. e4 e5 2. Nf3 Nf6");
  });

  test("Adds initial move number", () => {
    const game = new Chess(startFen);
    game.move("e4");
    const e4Fen = game.fen();
    const output = convertVariationToSan(e4Fen, "e5 2. Nf3 Nf6");
    expect(output).toBe("1... e5 2. Nf3 Nf6");
  });
});
