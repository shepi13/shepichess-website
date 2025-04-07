import {
    evaluatedPosition,
    currentFen,
} from "@/components/chess/__tests__/mocks/mockPlayComputer";

import { act, getByRole, getByText, render } from "@testing-library/react";
import { container, root } from "@/components/__tests__/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";
import {
    PlayAgainstComputer,
    PlayAgainstComputerParams,
} from "../PlayComputer";

const drawFen = "8/8/3k4/8/8/8/3K4/8 w - - 0 1";
const whiteWinFen = "8/8/8/8/8/4K3/8/5k1Q b - - 0 1";
const blackWinFen = "8/8/8/8/8/4k3/8/5K1q w - - 0 1";

describe("Test PlayComputer", () => {
    test("Test Playable Chessboard", () => {
        act(() => root.render(<PlayAgainstComputer />));
        expect(currentFen).toBe(startFen);
    });
    test("Test Engine Move", () => {
        act(() =>
            render(<PlayAgainstComputer start={startFen} playerColor="b" />),
        );
        // Engine should have been called with startfen
        expect(evaluatedPosition).toBe(startFen);
        // Any move should've been made
        expect(currentFen).not.toBe(startFen);
    });

    test("Test Undo Move", () => {
        act(() =>
            root.render(
                <PlayAgainstComputer start={startFen} playerColor="b" />,
            ),
        );
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

    test("Test Game Over", () => {
        act(() => root.render(<PlayAgainstComputer start={drawFen} />));
        expect(
            getByText(container, "Draw", { exact: false }),
        ).toBeInTheDocument();

        act(() => root.render(<PlayAgainstComputer start={whiteWinFen} />));
        expect(
            getByText(container, "White Wins", { exact: false }),
        ).toBeInTheDocument();

        act(() => root.render(<PlayAgainstComputer start={blackWinFen} />));
        expect(
            getByText(container, "Black Wins", { exact: false }),
        ).toBeInTheDocument();
    });

    test("Test Params", () => {
        // First mock of useParams has params
        act(() => render(<PlayAgainstComputerParams />));
        expect(currentFen).toBe(startFen);

        // Second has no params provided
        act(() => render(<PlayAgainstComputerParams />));
        expect(currentFen).toBe(startFen);
    });
});
