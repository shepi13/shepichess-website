import {
  currentFen,
  orientation,
} from "../../ChessBoard/__tests__/mocks/mockPlayableChessBoard";
import { audioState } from "./mocks/mockAudio";
import {
  mockEvaluatePosition,
  mockUseEngineWorker,
} from "@/lib/hooks/__tests__/mocks/mockUseEngine";

import {
  act,
  createEvent,
  fireEvent,
  getByLabelText,
} from "@testing-library/react";
import { Chess } from "chess.js";

import { EngineProvider } from "@/components/EngineProvider";

import { container, root } from "@/lib/test/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";

import { PGNViewer } from "../PGNViewer";

describe("Test PGNViewer", () => {
  test("Test default props", () => {
    act(() =>
      root.render(
        <EngineProvider>
          <PGNViewer />
        </EngineProvider>,
      ),
    );
    expect(currentFen).toBe(startFen);
  });

  test("Test Engine Analysis", () => {
    // Init engine (initially disabled)
    act(() =>
      root.render(
        <EngineProvider>
          <PGNViewer />
        </EngineProvider>,
      ),
    );
    const analysisToggle = getByLabelText(container, "Stockfish toggle");
    const pv = getByLabelText(container, "stockfish-pv");
    const depth = getByLabelText(container, "stockfish-depth");
    const evaluation = getByLabelText(container, "stockfish-eval");
    expect(analysisToggle).toBeInTheDocument();
    expect(pv).toBeInTheDocument();
    expect(depth).toBeInTheDocument();
    expect(evaluation).toBeInTheDocument();
    expect(mockUseEngineWorker).toHaveBeenCalled();
    expect(mockEvaluatePosition).not.toHaveBeenCalled();

    // Test engine enable
    act(() => analysisToggle.click());
    expect(mockUseEngineWorker).toHaveBeenCalled();
    expect(mockEvaluatePosition).toHaveBeenCalled();
    expect(pv.hasAttribute("hidden")).toBe(false);
    expect(depth.hasAttribute("hidden")).toBe(false);
    expect(evaluation.hasAttribute("hidden")).toBe(false);

    // Test disable
    act(() => analysisToggle.click());
    expect(pv.hasAttribute("hidden")).toBe(true);
    expect(depth.hasAttribute("hidden")).toBe(true);
    expect(evaluation.hasAttribute("hidden")).toBe(true);
  });

  describe("Test Key Handlers", () => {
    const pgn =
      "1. e4 e5 2. Nf3! [c2c3red] {Hello!} (2. d4? (2. c3) exd4 (2...d6))";

    beforeEach(() => {
      act(() =>
        root.render(
          <EngineProvider>
            <PGNViewer {...{ pgn, start: startFen, small: true }} />
          </EngineProvider>,
        ),
      );
    });

    test("Prevent default only if handled", () => {
      const viewer = getByLabelText(container, "PGN Viewer");
      let keydownEvent = createEvent.keyDown(viewer, {
        key: "a",
        code: "Keya",
      });
      act(() => {
        fireEvent(viewer, keydownEvent);
      });
      expect(keydownEvent.defaultPrevented).toBe(false);

      keydownEvent = createEvent.keyDown(viewer, { key: "f", code: "Keyf" });
      act(() => {
        fireEvent(viewer, keydownEvent);
      });
      expect(keydownEvent.defaultPrevented).toBe(true);
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
      // Test move audio was played
      expect(audioState.play).toHaveBeenCalledTimes(moves.length);

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
