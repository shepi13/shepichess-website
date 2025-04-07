import { act, getByTestId, getByText } from "@testing-library/react";
import { root, container } from "@/components/__tests__/componentTestHelpers";
import { loadPgn } from "@/lib/utils/loadPgn";
import { startFen } from "@/lib/types/pgnTypes";
import PGNViewerNotation from "../PGNViewerNotation";

describe("Test PGNViewerNotation", () => {
  const variation = loadPgn(
    "1. e4 e5 2. Nf3! [c2c3red] {Hello!} (2. d4? (2. c3) exd4 (2...d6))",
    startFen,
  );
  let gameState = { variation, halfMoveNum: 1 };
  const setGameState = jest.fn((callback) => {
    gameState = callback(gameState);
  });

  beforeEach(() => {
    act(() =>
      root.render(
        <PGNViewerNotation {...{ variation, gameState, setGameState }} />,
      ),
    );
  });

  test.each([
    ["1. e4", 1],
    ["e5", 2],
    ["2. Nf3!", 3],
  ])("Current Move highlighted", (moveId, moveNum) => {
    act(() =>
      root.render(
        <PGNViewerNotation
          {...{
            variation,
            gameState: { ...gameState, halfMoveNum: moveNum },
            setGameState,
          }}
        />,
      ),
    );
    const currentMove = getByTestId(container, moveId);
    expect(currentMove).toBeInTheDocument();
    expect(currentMove.className.includes("bg-")).toBe(true);
  });
  test.each(["e5", "2. d4?", "2. c3"])("Click Move", (moveId) => {
    let currentMove = getByTestId(container, moveId);
    expect(currentMove.className.includes("bg-")).toBe(false);

    act(() => {
      currentMove.click();
      root.render(
        <PGNViewerNotation {...{ variation, gameState, setGameState }} />,
      );
    });

    currentMove = getByTestId(container, moveId);
    expect(setGameState).toHaveBeenCalled();
    expect(currentMove.className.includes("bg-")).toBe(true);
  });
  test("Comment rendered", () => {
    expect(getByText(container, "Hello!")).toBeInTheDocument();
  });
});
