import { act, getByLabelText, getByText, screen } from "@testing-library/react";

import { container, root } from "@/lib/test/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";
import { loadPgn } from "@/lib/utils/loadPgn";

import { PGNViewerNotation } from "../PGNViewerNotation";

describe("Test PGNViewerNotation", () => {
  const { gameTree: variation } = loadPgn(
    "1. e4 e5 2. Nf3! [c2c3red] {Hello!} (2. d4?$13 (2. c3) exd4 (2...d6))",
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

  test("PGN Viewer Puzzle", () => {
    act(() =>
      root.render(
        <PGNViewerNotation
          {...{ gameState, setGameState }}
          puzzle="Puzzle!"
          variation={variation}
        />,
      ),
    );
    // Already played moves should show.
    const firstMove = getByLabelText(container, "Move: " + "1. e4");
    expect(firstMove).toBeInTheDocument();

    // Later moves should be hidden.
    expect(() => getByLabelText(container, "2. Nf3!")).toThrow();
  });

  test("PGN Viewer Puzzle Comment", () => {
    act(() =>
      root.render(
        <PGNViewerNotation
          {...{ gameState: { ...gameState, halfMoveNum: 0 }, setGameState }}
          puzzle="Puzzle!"
          variation={variation}
        />,
      ),
    );
    // No moves should show
    expect(() => getByLabelText(container, "Move: " + "1. e4")).toThrow();

    // Puzzle Comment should show
    expect(getByText(container, "Puzzle!")).toBeInTheDocument();
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
    const currentMove = getByLabelText(container, "Move: " + moveId);
    expect(currentMove).toBeInTheDocument();
    expect(currentMove.className.includes("bg-")).toBe(true);
  });
  test.each(["e5", "2. d4?&infin;", "2. c3"])("Click Move", (moveId) => {
    let currentMove = getByLabelText(container, "Move: " + moveId);
    expect(currentMove.className.includes("bg-")).toBe(false);

    act(() => {
      currentMove.click();
      root.render(
        <PGNViewerNotation {...{ variation, gameState, setGameState }} />,
      );
    });

    currentMove = getByLabelText(container, "Move: " + moveId);
    expect(setGameState).toHaveBeenCalled();
    expect(currentMove.className.includes("bg-")).toBe(true);
  });
  test("Comment rendered", () => {
    expect(getByText(container, "Hello!")).toBeInTheDocument();
  });

  test("Flat subvariations", () => {
    const { gameTree: variation } = loadPgn(
      "1. e4 e5 (1...e6) (1...c5)",
      startFen,
    );
    act(() =>
      root.render(
        <PGNViewerNotation {...{ variation, gameState, setGameState }} />,
      ),
    );
    expect(screen.getByText("e6")).toBeInTheDocument();
    expect(screen.getByText("c5")).toBeInTheDocument();
  });
});
