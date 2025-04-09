import { currentFen, orientation } from "./mocks/mockPlayableChessBoard";

import { act, fireEvent, getByLabelText } from "@testing-library/react";
import { Chess } from "chess.js";

import { container, root } from "@/lib/test/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";

import PGNViewer from "../PGNViewer";

describe("Test PGNViewer", () => {
  test("Test default props", () => {
    act(() => root.render(<PGNViewer />));
    expect(currentFen).toBe(startFen);
  });

  describe("Test Key Handlers", () => {
    const pgn =
      "1. e4 e5 2. Nf3! [c2c3red] {Hello!} (2. d4? (2. c3) exd4 (2...d6))";

    beforeEach(() => {
      act(() => root.render(<PGNViewer {...{ pgn, start: startFen }} />));
    });

    // Key Handler and Button Tests
    test("Flip Board", () => {
      expect(orientation).toBe("white");
      const viewer = getByLabelText(container, "PGN Viewer");

      act(() => {
        fireEvent.keyDown(viewer, { key: "f", code: "Keyf" });
      });
      expect(orientation).toBe("black");

      act(() => {
        fireEvent.keyDown(viewer, { key: "F", code: "KeyF" });
      });
      expect(orientation).toBe("white");
    });
    test("Next/Prev Move", () => {
      const game = new Chess(startFen);
      const moves = ["e4", "e5", "Nf3"];
      expect(currentFen).toBe(game.fen());

      const viewer = getByLabelText(container, "PGN Viewer");

      // Test Next Moves
      for (let i = 0; i < 5; i++) {
        act(() => {
          fireEvent.keyDown(viewer, {
            key: "ArrowRight",
            code: "ArrowRight",
            charCode: 39,
          });
        });
        if (i < moves.length) game.move(moves[i]);
        expect(currentFen).toBe(game.fen());
      }

      // Now undo to test prev moves
      for (let i = 0; i < 5; i++) {
        act(() => {
          fireEvent.keyDown(viewer, {
            key: "ArrowLeft",
            code: "ArrowLeft",
            charCode: 37,
          });
        });
        game.undo();
        expect(currentFen).toBe(game.fen());
      }
    });

    test("First/Last Move", () => {
      const game = new Chess(startFen);
      game.loadPgn("1. e4 e5 2. Nf3");

      const viewer = getByLabelText(container, "PGN Viewer");

      act(() => {
        fireEvent.keyDown(viewer, {
          key: "ArrowDown",
          code: "ArrowDown",
          charCode: 40,
        });
      });
      expect(currentFen).toBe(game.fen());

      act(() => {
        fireEvent.keyDown(viewer, {
          key: "ArrowUp",
          code: "ArrowUp",
          charCode: 38,
        });
      });
      expect(currentFen).toBe(startFen);
    });

    test("Enter/Exit Variation", () => {
      const game = new Chess(startFen);
      game.loadPgn("1. e4 e5 2. Nf3");
      const preVariationFen = game.fen();

      game.loadPgn("1. e4 e5 2. d4");
      const firstVariationFen = game.fen();

      game.loadPgn("1. e4 e5 2. c3");
      const secondVariationFen = game.fen();

      const viewer = getByLabelText(container, "PGN Viewer");

      // Enter Variations
      act(() => {
        fireEvent.keyDown(viewer, { key: " ", code: "Space", charCode: 32 });
      });
      expect(currentFen).toBe(firstVariationFen);

      act(() => {
        fireEvent.keyDown(viewer, { key: " ", code: "Space", charCode: 32 });
      });
      expect(currentFen).toBe(secondVariationFen);

      // Exit variations
      act(() => {
        fireEvent.keyDown(viewer, {
          key: "Escape",
          code: "Escape",
          charCode: 27,
        });
      });
      expect(currentFen).toBe(firstVariationFen);
      act(() => {
        fireEvent.keyDown(viewer, {
          key: "Escape",
          code: "Escape",
          charCode: 27,
        });
      });
      expect(currentFen).toBe(preVariationFen);
    });
  });
});
