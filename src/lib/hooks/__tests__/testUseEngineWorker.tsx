import {
  constructorSpyMock,
  postMessageSpyMock,
  terminateSpyMock,
} from "./mocks/mockStockfishWorker";

import { describe, expect, jest, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { startFen } from "@/lib/types/pgnTypes";

import { StockfishResult, useEngine } from "../useEngineWorker";

let bestMove: string,
  ponder: string,
  evaluation: number,
  pv: string,
  depth: number;

function saveStateCallback(result: StockfishResult) {
  ({ bestMove, ponder, evaluation, pv, depth } = result);
}

const uciCallback = jest.fn();

describe("Hooks/useEngine", () => {
  test("Successful UCI Init", () => {
    renderHook(() => useEngine(uciCallback, true));
    expect(constructorSpyMock).toHaveBeenCalled();
    expect(postMessageSpyMock).toBeCalledWith("uci");
    expect(postMessageSpyMock).toBeCalledWith("isready");
    expect(uciCallback).toBeCalled();
  });

  test("Evaluate Position with callback", () => {
    const { result } = renderHook(() => useEngine(saveStateCallback, true));
    act(() => result.current.evaluatePosition(startFen, 10));

    expect(bestMove).toBe("e2e4");
    expect(ponder).toBe("e7e5");
    expect(evaluation).toBe("40");
    expect(pv).toBe("e2e4 e7e5");
    expect(depth).toBe(12);

    act(() => result.current.evaluatePosition(startFen, 10));
    expect(depth).toBe(0);
  });

  test("UCI Stop", () => {
    const { result } = renderHook(() => useEngine(uciCallback, true));
    expect(constructorSpyMock).toHaveBeenCalled();

    act(result.current.stop);
    expect(postMessageSpyMock).toBeCalledWith("stop");
  });

  test("Enable/Disable worker", () => {
    // Test enabled
    const { rerender } = renderHook(
      (enabled) => useEngine(uciCallback, enabled),
      { initialProps: true },
    );
    expect(constructorSpyMock).toHaveBeenCalled();
    expect(postMessageSpyMock).not.toBeCalledWith("quit");
    expect(terminateSpyMock).not.toBeCalled();

    // Reset
    constructorSpyMock.mockClear();
    postMessageSpyMock.mockClear();

    // Test Disabled
    rerender(false);
    expect(postMessageSpyMock).toBeCalledWith("quit");
    expect(terminateSpyMock).toBeCalled();
    expect(constructorSpyMock).not.toBeCalled();
  });
});
