import { jest } from "@jest/globals";

import { StockfishResult } from "../../useEngineWorker";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockEvaluatePosition = jest.fn((fen: string, depth: number) => {});

export const mockUseEngineWorker = jest.fn(
  (callback: (arg0: StockfishResult) => void, enabled: boolean) => {
    mockEvaluatePosition.mockImplementation((fen: string, depth: number) => {
      if (!enabled) {
        throw new Error(
          "Evaluate position shouldn't be called while disabled!",
        );
      }
      callback({
        bestMove: "e2e4",
        ponder: "e7e5",
        evaluation: 40,
        possibleMate: "",
        pv: "e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3 f6e4",
        depth,
      });
    });
    return { evaluatePosition: mockEvaluatePosition, stop: jest.fn() };
  },
);

jest.mock("@/lib/hooks/useEngineWorker", () => {
  const original = jest.requireActual("@/lib/hooks/useEngineWorker");
  // Correct: returns a mock object
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(original as any),
    useEngine: mockUseEngineWorker,
  };
});
