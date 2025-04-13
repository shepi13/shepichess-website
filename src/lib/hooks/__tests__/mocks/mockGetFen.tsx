import { jest } from "@jest/globals";

export const mockGetFen = jest.fn();
jest.mock("@/lib/utils/chessUtils", () => {
  const original = jest.requireActual("@/lib/utils/chessUtils");
  // Correct: returns a mock object
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(original as any),
    getFen: mockGetFen,
  };
});
