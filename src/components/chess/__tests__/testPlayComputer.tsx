import { mockUseEngine } from "@/components/chess/__tests__/mockPlayComputer";

import { act, getByRole, render } from "@testing-library/react";
import { container, root } from "@/components/__tests__/componentTestHelpers"
import { startFen } from "@/lib/types/pgnTypes";
import { PlayAgainstComputer, PlayAgainstComputerParams } from "../PlayComputer";

const engineMock = mockUseEngine;
const drawFen = "8/8/3k4/8/8/8/3K4/8 w - - 0 1";
const whiteWinFen = "8/8/8/8/8/4K3/8/5k1Q b - - 0 1";
const blackWinFen = "8/8/8/8/8/4k3/8/5K1q w - - 0 1";

describe("Test PlayComputer", () => {
    test("Test Playable Chessboard", () => {
        act(() => root.render(<PlayAgainstComputer />));
    });
    test("Test Engine Move", () => {
        act(() => root.render(<PlayAgainstComputer start={startFen} playerColor="b"/>))
    });

    test("Test Undo Move", () => {
        act(() => root.render(<PlayAgainstComputer start={startFen} playerColor="b"/>));
        const undoButton = getByRole(container, "button", {name: "Undo"});
        act(() => undoButton.click());
    })

    test("Test Game Over", () => {
        act(() => root.render(<PlayAgainstComputer start={drawFen}/>));

        act(() => root.render(<PlayAgainstComputer start={whiteWinFen}/>));

        act(() => root.render(<PlayAgainstComputer start={blackWinFen}/>));
    });

    test("Test Params", () => {
        // First mock of useParams has params
        act(() => render(<PlayAgainstComputerParams />));

        // Second has no params provided
        act(() => render(<PlayAgainstComputerParams />));
    });
});