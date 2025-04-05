import { mockUseEngine } from "@/components/chess/__tests__/mockUseEngine";

import { act } from "@testing-library/react";
import { root } from "@/components/__tests__/componentTestHelpers"
import { startFen } from "@/lib/types/pgnTypes";
import { PlayAgainstComputer } from "../PlayComputer";

const engineMock = mockUseEngine

describe("Test PlayComputer", () => {
    test("Test Playable Chessboard", () => {
        act(() => root.render(<PlayAgainstComputer start={startFen} />));
    });
    test("Test Custom FlipText", () => {});
});