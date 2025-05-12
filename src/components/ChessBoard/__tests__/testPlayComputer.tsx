import { audioState } from "../../PGNViewer/__tests__/mocks/mockAudio";
import { currentFen, evaluatedPosition } from "./mocks/mockPlayComputer";
import { mockToast } from "./mocks/mockToast";

import { act, getByRole, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { container, root } from "@/lib/test/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";

import { PlayComputer, PlayComputerPage } from "../PlayComputer";

const drawFen = "8/8/3k4/8/8/8/3K4/8 w - - 0 1";
const whiteWinFen = "8/8/8/8/8/4K3/8/5k1Q b - - 0 1";
const blackWinFen = "8/8/8/8/8/4k3/8/5K1q w - - 0 1";

describe("Test PlayComputer", () => {
  test("Test Playable Chessboard", () => {
    act(() => root.render(<PlayComputer />));
    expect(currentFen).toBe(startFen);
  });
  test("Test Engine Move", () => {
    act(() => render(<PlayComputer start={startFen} side="b" />));
    // Engine should have been called with startfen
    expect(evaluatedPosition).toBe(startFen);
    // Any move should've been made
    expect(currentFen).not.toBe(startFen);
    // Sound should have played
    expect(audioState.play).toHaveBeenCalled();
  });

  test("Test Undo Move", () => {
    act(() => root.render(<PlayComputer start={startFen} side="b" />));
    const flipButton = getByRole(container, "button", { name: "Flip" });
    const undoButton = getByRole(container, "button", { name: "Undo" });

    const firstMoveFen = currentFen;
    expect(currentFen).not.toBe(startFen);

    // Engine should have made a move, after we switch sides it will make another
    act(() => flipButton.click());
    expect(currentFen).not.toBe(firstMoveFen);
    expect(currentFen).not.toBe(startFen);

    // Undoing should undo both.
    act(() => undoButton.click());
    expect(currentFen).toBe(startFen);
  });

  test("Test Params", () => {
    // First mock of useParams has params
    act(() => render(<PlayComputerPage />));
    expect(currentFen).toBe(startFen);

    // Second has no params provided
    act(() => render(<PlayComputerPage />));
    expect(currentFen).toBe(startFen);
  });

  test("Test Setting Fen Params", async () => {
    const user = userEvent.setup();
    act(() => root.render(<PlayComputerPage />));
    const newFen =
      "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6";

    const fenInput = getByRole(container, "textbox", { name: "Input Fen" });
    const fenSubmit = getByRole(container, "button", { name: "Submit Fen" });
    expect(fenInput).toBeInTheDocument();
    expect(fenSubmit).toBeInTheDocument();

    await user.clear(fenInput);
    await user.type(fenInput, newFen);
    await user.click(fenSubmit);

    expect(currentFen).toBe(newFen);
    expect(decodeURIComponent(global.window.location.search)).toContain(
      "fen=" + newFen.replaceAll(" ", "+"),
    );
  });

  test.each([
    [drawFen, "draw"],
    [whiteWinFen, "white"],
    [blackWinFen, "black"],
  ])("Test Game Over", (fen, toastString) => {
    act(() => root.render(<PlayComputer start={fen} />));

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast.mock.calls[0][0].toLowerCase()).toContain("game over");
    expect(mockToast.mock.calls[0][1]["description"].toLowerCase()).toContain(
      toastString,
    );
  });
});
