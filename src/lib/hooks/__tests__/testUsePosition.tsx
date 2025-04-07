import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import usePosition from "../usePosition";
import { Position, startFen } from "@/lib/types/pgnTypes";

const testFen =
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
const Nf3Fen = "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1";

describe("Hooks/usePosition", () => {
  describe("Test usePosition Methods", () => {
    let result: { current: Position };
    beforeEach(() => {
      ({ result } = renderHook(usePosition));
    });
    test("Set Position", () => {
      act(() => result.current.setPosition(testFen));
      expect(result.current.game.fen()).toBe(testFen);
      expect(result.current.position).toBe(testFen);
    });
    test("Reset Position", () => {
      act(() => result.current.setPosition(testFen));
      act(result.current.resetPosition);
      expect(result.current.game.fen()).toBe(startFen);
      expect(result.current.position).toBe(startFen);
    });
    test("Make Move (no promotion string)", () => {
      act(() => result.current.makeMove("g1", "f3", ""));
      expect(result.current.game.fen()).toBe(Nf3Fen);
      expect(result.current.position).toBe(Nf3Fen);
    });
    test("Make Move (promotion string)", () => {
      // Sometimes this is set by default in react chessboard
      act(() => result.current.makeMove("g1", "f3", "q"));
      expect(result.current.game.fen()).toBe(Nf3Fen);
      expect(result.current.position).toBe(Nf3Fen);
    });
    test("Undo Move", () => {
      act(() => result.current.makeMove("g1", "f3", ""));
      act(result.current.undoMove);
      expect(result.current.game.fen()).toBe(startFen);
      expect(result.current.position).toBe(startFen);
    });
    test("Illegal Move", () => {
      global.console = { ...global.console, log: jest.fn() };
      act(() => result.current.makeMove("a1", "a8", ""));
      expect(result.current.game.fen()).toBe(startFen);
      expect(result.current.position).toBe(startFen);
      expect(console.log).toBeCalled();
    });
    test("Flip Board", () => {
      act(result.current.toggleFlipped);
      expect(result.current.flipped).toBe(true);
    });
  });

  describe("Test usePosition with defaults", () => {
    let result: { current: Position };
    beforeEach(() => {
      ({ result } = renderHook(() => usePosition(testFen, true)));
    });

    test("Test Initial Orientation", () => {
      expect(result.current.flipped).toBe(true);
      expect(result.current.player).toBe("b");

      act(result.current.toggleFlipped);
      expect(result.current.flipped).toBe(false);
      expect(result.current.player).toBe("b");
    });

    test("Test Initial Position", () => {
      expect(result.current.position).toBe(testFen);
      expect(result.current.game.fen()).toBe(testFen);
    });
  });
});
