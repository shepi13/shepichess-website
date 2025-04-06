import { act } from "@testing-library/react";
import { root } from "@/components/__tests__/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";
import { PlayableChessBoard } from "../PlayableChessBoard";

describe("Test PlayableChessBoard", () => {
    beforeEach(() => {
        act(() => root.render(<PlayableChessBoard start={startFen} />));
    });

    test("Test Playable Chessboard", () => {});
    test("Test Custom FlipText", () => {});
});
