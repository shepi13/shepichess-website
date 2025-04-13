import {
  mockEvaluatePosition,
  mockUseEngineWorker,
} from "./mocks/mockUseEngine";

import { renderHook } from "@testing-library/react";
import { act } from "react";

import { EngineProvider } from "@/components/EngineProvider";

import { startFen } from "@/lib/types/pgnTypes";

import { useEngineAnalysis } from "../useEngineAnalysis";

describe("Test UseEngineAnalysis hook", () => {
  test("Test hook", () => {
    renderHook(() => useEngineAnalysis(startFen, 12, 1), {
      wrapper: EngineProvider,
    });
    expect(mockUseEngineWorker).toHaveBeenCalled();
  });

  test("Test no context provider throws", () => {
    expect(() =>
      renderHook(() => useEngineAnalysis(startFen, 12, 1)),
    ).toThrow();
  });

  test("Test enable/disable", () => {
    const { result } = renderHook(() => useEngineAnalysis(startFen, 12, 1), {
      wrapper: EngineProvider,
    });

    const [stockfishdata, enabled, setenabled] = result.current;
    expect(enabled).toBe(false);
    expect(stockfishdata.bestMove).toBeFalsy();

    act(() => setenabled(true));
    expect(result.current[1]).toBe(true);
    expect(mockEvaluatePosition).toHaveBeenCalled();

    act(() => setenabled(false));
    expect(result.current[1]).toBe(false);
  });

  test("Test Mock Stockfish Data", () => {
    const { result } = renderHook(() => useEngineAnalysis(startFen, 12, 2), {
      wrapper: EngineProvider,
    });

    const setEnabled = result.current[2];
    act(() => setEnabled(true));

    const stockfishData = result.current[0];
    expect(stockfishData.bestMove).toBe("e2e4");
    expect(stockfishData.pv).toBe("1. e4 e5");
    expect(stockfishData.depth).toBe(12);
  });

  test("Test data should be empty for low depth", () => {
    const { result } = renderHook(() => useEngineAnalysis(startFen, 3, 2), {
      wrapper: EngineProvider,
    });

    const setEnabled = result.current[2];
    act(() => setEnabled(true));

    const stockfishData = result.current[0];
    expect(stockfishData.bestMove).toBe("");
    expect(stockfishData.pv).toBe("");
    expect(stockfishData.depth).toBe(0);
  });
});
