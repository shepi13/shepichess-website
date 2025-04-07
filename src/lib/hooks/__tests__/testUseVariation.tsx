import { mockGetFen } from "./mocks/mockUseVariation";

import { describe, test, expect, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { startFen, VariationState } from "@/lib/types/pgnTypes";
import useVariation from "../useVariation";

import { loadPgn } from "@/lib/utils/loadPgn";

describe("Hooks/useVariation", () => {
  let result: { current: VariationState };
  beforeEach(() => {
    const variationTree = loadPgn(
      "1. e4 e5 2. Nf3 (2. d4 (2. c3 Nf6 3. d4))",
      startFen,
    );
    ({ result } = renderHook(() => useVariation(variationTree)));
  });

  test("Test lastMove", () => {
    act(result.current.lastMove);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    const move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("Nf3");
    expect(move.moveNumber).toBe(2);
    expect(move.variation).not.toBeFalsy();
    expect(variation.parentVariation).toBeNull();
  });

  test("Test firstMove", () => {
    act(result.current.lastMove);
    act(result.current.firstMove);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    expect(halfMoveNum).toBe(0);
    expect(variation.parentVariation).toBeNull();
  });

  test("Test nextMove", () => {
    act(result.current.nextMove);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    const move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("e4");
    expect(move.moveNumber).toBe(1);

    // Verify we can't go out of bounds
    for (let i = 0; i < 10; i++) {
      act(result.current.nextMove);
    }
    expect(result.current.halfMoveNum).toBe(3);
  });

  test("Test prevMove", () => {
    act(result.current.nextMove);
    act(result.current.nextMove);
    act(result.current.prevMove);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    const move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("e4");
    expect(move.moveNumber).toBe(1);
    act(result.current.prevMove);
    expect(result.current.halfMoveNum).toBe(0);

    // Verify we can't go out of bounds
    act(result.current.prevMove);
    expect(result.current.halfMoveNum).toBe(0);
  });

  test("Test enterVariation", () => {
    act(result.current.enterVariation);
    let variation = result.current.variation;
    let halfMoveNum = result.current.halfMoveNum;
    let move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("d4");

    act(result.current.enterVariation);
    variation = result.current.variation;
    halfMoveNum = result.current.halfMoveNum;
    move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("c3");

    // Entering a nonexistant variation should have no effect
    act(result.current.enterVariation);
    variation = result.current.variation;
    halfMoveNum = result.current.halfMoveNum;
    move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("c3");
  });

  test("Test firstMove from variation", () => {
    act(result.current.enterVariation);
    act(result.current.firstMove);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    expect(halfMoveNum).toBe(0);
    expect(variation.parentVariation).toBeNull();
  });

  test("Test exitVariation", () => {
    act(result.current.enterVariation);
    act(result.current.exitVariation);
    const variation = result.current.variation;
    const halfMoveNum = result.current.halfMoveNum;
    const move = variation.moves[halfMoveNum - 1];
    expect(move.move).toBe("Nf3");
    expect(move.moveNumber).toBe(2);
    expect(move.variation).not.toBeFalsy();
    expect(variation.parentVariation).toBeNull();
    // Test trying to leave top level variation
    act(result.current.exitVariation);
    expect(move.variation).not.toBeFalsy();
    expect(variation.parentVariation).toBeNull();
  });

  test("Test getFen", () => {
    act(result.current.fen);
    expect(mockGetFen).toBeCalled();
  });

  test("Test setGameState", () => {
    act(() =>
      result.current.setGameState(() => ({
        variation: result.current.variation,
        halfMoveNum: 2,
      })),
    );
    expect(result.current.halfMoveNum).toBe(2);
  });

  test("Test setGameState Illegal", () => {
    act(() =>
      result.current.setGameState(() => ({
        variation: result.current.variation,
        halfMoveNum: 10,
      })),
    );
    expect(result.current.halfMoveNum).toBe(0);
  });
});
