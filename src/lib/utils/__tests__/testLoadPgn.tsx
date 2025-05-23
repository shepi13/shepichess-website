import { describe, expect, test } from "@jest/globals";
import { Square } from "chess.js";

import { startFen } from "@/lib/types/pgnTypes";
import { loadPgn } from "@/lib/utils/loadPgn";

describe("PGN Parser Test", () => {
  test("Test PGN Headers", () => {
    const testPGN = `[FEN "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6"]
    6. Be3 e5 7. Nb3 Ng4!?`;
    const najdorfFen =
      "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6";
    const result = loadPgn(testPGN);
    expect(result.headers.get("fen")).toBe(najdorfFen);
    expect(result.gameTree.start).toBe(najdorfFen);
    expect(result.gameTree.moves[0].move).toBe("Be3");
    expect(result.gameTree.moves[3].move).toBe("Ng4");
  });

  describe("Test PGN Annotations", () => {
    const annotationTable = [
      ["!$13", "!&infin;"],
      ["!  $13", "!&infin;"],
      ["$1$15", "!&eplus;"],
      ["     $1  $10", "!="],
      ["     !   $10", "!="],
      ["$2     $133", "?&lrarr;"],
    ];
    test.each(annotationTable)(
      "Annotations Single Variation",
      (annotations, expected) => {
        const testPgn = "1. e4 e5 2. Nf3 Nc6" + annotations;
        const variation = loadPgn(testPgn, startFen).gameTree;
        expect(variation.moves[3].annotation).toBe(expected);
      },
    );
    test.each(annotationTable)(
      "Annotations Nested",
      (annotations, expected) => {
        const testPgn = "1.e4 e5 (1... c5" + annotations + ")";
        const variation = loadPgn(testPgn, startFen).gameTree.moves[1]
          .variations[0];
        expect(variation).not.toBeNull();

        if (variation !== null) {
          expect(variation.moves[0].annotation).toBe(expected);
        }
      },
    );
    test("Annotations Empty", () => {
      const testPgn =
        "1. e4 e5 {Fake Comment! Position is =} (1... Nf6 {Alekhine!?!?!})";
      const variation = loadPgn(testPgn, startFen).gameTree;
      expect(variation.moves[0].annotation).toBe("");
      expect(variation.moves[1].annotation).toBe("");
      const nestedVariation = variation.moves[1].variations[0];
      if (nestedVariation) {
        expect(nestedVariation.moves[0].annotation).toBe("");
      }
    });
  });

  describe("Test PGN Arrows", () => {
    const arrowTable: Array<[string, Array<[Square, Square, string]>]> = [
      [
        "[f8c5red f8e7blue     f8b4green]",
        [
          ["f8", "c5", "red"],
          ["f8", "e7", "blue"],
          ["f8", "b4", "green"],
        ],
      ],
      ["[a4b4orange]", [["a4", "b4", "orange"]]],
      ["[]", []],
      ["", []],
    ];
    test.each(arrowTable)("Arrows Single Variation", (arrows, expected) => {
      const testPgn = "1. e4 " + arrows;
      const variation = loadPgn(testPgn, startFen).gameTree;
      expect(variation.moves[0].arrows).toStrictEqual(expected);
    });
    test.each(arrowTable)("Arrows Nested", (arrows, expected) => {
      const testPgn = "1.e4 e5 (1... c5 " + arrows + ")";
      const variation = loadPgn(testPgn, startFen).gameTree.moves[1]
        .variations[0];
      expect(variation).not.toBeNull();
      if (variation !== null) {
        expect(variation.moves[0].arrows).toStrictEqual(expected);
      }
    });
    test("Arrows empty", () => {
      const testPgn =
        "1. e4 e5 {[Fake Arrows] [f8 e6]} (1... Nf6 {Alek([hine])!?!?!})";
      const variation = loadPgn(testPgn, startFen).gameTree;
      expect(variation.moves[0].arrows).toStrictEqual([]);
      expect(variation.moves[1].arrows).toStrictEqual([]);
      const nestedVariation = variation.moves[1].variations[0];
      if (nestedVariation) {
        expect(nestedVariation.moves[0].arrows).toStrictEqual([]);
      }
    });
  });

  //Slightly simpler test because pgn comments can't be nested themselves so should be relatively safe
  describe("Test PGN Comments", () => {
    const commentTable = [
      ["{}", ""],
      ["", ""],
      ["{Test Comment}", "Test Comment"],
    ];
    test.each(commentTable)("Comments Single Var", (comment, expected) => {
      const testPgn = "1. e4 e5 " + comment;
      const variation = loadPgn(testPgn, startFen).gameTree;
      expect(variation.moves[1].comment).toStrictEqual(expected);
    });
    test.each(commentTable)("Comments Nested", (comment, expected) => {
      const testPgn = "1.e4 e5 (1... c5 " + comment + ")";
      const variation = loadPgn(testPgn, startFen).gameTree.moves[1]
        .variations[0];
      expect(variation).not.toBeNull();
      if (variation !== null) {
        expect(variation.moves[0].comment).toStrictEqual(expected);
      }
    });
  });

  describe("Test PGN Variations", () => {
    test("Test Single Variation", () => {
      const testPgn = "1. e4 e5 2. Nf3 (2. f4)";
      const mainVar = loadPgn(testPgn, startFen).gameTree;
      const variation = mainVar.moves[2].variations[0];
      expect(variation).not.toBeNull();
      expect(variation?.start).toEqual(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
      );
      expect(variation?.moves[0]).toMatchObject({
        move: "f4",
        moveNumber: 2,
        color: "w",
        fenAfter:
          "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2",
      });
      expect(variation?.parentVariation?.id).toStrictEqual(mainVar.id);
    });
    test("Test Nested Variation", () => {
      const testPgn = "1. e4 e5 2. Nf3 (2. f4 (2. Nc3))";
      const mainVar = loadPgn(testPgn, startFen).gameTree;
      const variation = mainVar.moves[2].variations[0]?.moves[0].variations[0];
      expect(variation).not.toBeNull();
      expect(variation?.start).toEqual(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
      );
      expect(variation?.moves[0]).toMatchObject({
        move: "Nc3",
        moveNumber: 2,
        color: "w",
        fenAfter:
          "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
      });
      expect(variation?.parentVariation?.id).toStrictEqual(
        mainVar.moves[2].variations[0]?.id,
      );
    });
  });

  test("Test PGN Integration", () => {
    const testPgn =
      "2...d6 {Philidor} (2...Nc6 [g8f6blue] {()[Tricky] Comment()} (2...Nf6) 3. Bb5 {Spanish (Ruy) Opening} Nf6 {Berlin} 4. d3!? " +
      "[f8c5red f8e7blue] Bc5! (4...Be7?! (4...g6)) 5. c3 {Tabia} 0-0 6. 0-0!$15 [h2h4red g2g4orange] {Comment!}) 3. d4 (3. Bc4) Bg4?";
    const { gameTree: mainVar } = loadPgn(
      testPgn,
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    );
    expect(mainVar.moves[0].variations[0]?.moves[7]).toMatchObject({
      move: "0-0",
      annotation: "!&eplus;",
      comment: "Comment!",
      arrows: [
        ["h2", "h4", "red"],
        ["g2", "g4", "orange"],
      ],
      moveNumber: 6,
      color: "w",
      fenAfter:
        "r1bq1rk1/pppp1ppp/2n2n2/1Bb1p3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 b - - 2 6",
    });
  });
});
