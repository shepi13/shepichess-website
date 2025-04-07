import { currentFen, orientation } from "./mocks/mockPlayableChessBoard";

import { act, getByRole } from "@testing-library/react";
import { root, container } from "@/components/__tests__/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";
import PlayableChessBoardStateless, {
    PlayableChessBoard,
} from "../PlayableChessBoard";
import usePosition from "@/lib/hooks/usePosition";

describe("Test PlayableChessBoard", () => {
    test("Test Playable Chessboard", () => {
        act(() => root.render(<PlayableChessBoard start={startFen} />));
        expect(currentFen).toBe(startFen);
        expect(orientation).toBe("white");
    });
    test("Test Flip Board", () => {
        act(() => root.render(<PlayableChessBoard start={startFen} />));
        const flipButton = getByRole(container, "button", {
            name: "Flip Board!",
        });
        act(() => flipButton.click());
        expect(currentFen).toBe(startFen);
        expect(orientation).toBe("black");
    });
    test("Test Orientation Black", () => {
        act(() => root.render(<PlayableChessBoard start={startFen} flipped />));
        expect(currentFen).toBe(startFen);
        expect(orientation).toBe("black");
    });
    test("Test Reset Board", () => {
        const resetMock = jest.fn();
        const TestComponent = () => {
            const position = {
                ...usePosition(startFen),
                resetPosition: resetMock,
            };
            return <PlayableChessBoardStateless position={position} />;
        };
        act(() => {
            root.render(<TestComponent />);
        });

        const resetButton = getByRole(container, "button", { name: "Reset" });
        expect(resetButton).toBeInTheDocument();
        expect(resetMock).not.toHaveBeenCalled();

        act(() => resetButton.click());
        expect(resetMock).toHaveBeenCalled();
    });
});
