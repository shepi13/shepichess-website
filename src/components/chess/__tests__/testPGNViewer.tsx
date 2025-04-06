import { act } from "@testing-library/react";
import { root } from "@/components/__tests__/componentTestHelpers";
import { startFen } from "@/lib/types/pgnTypes";
import PGNViewer from "../PGNViewer";

describe("Test PGNViewer", () => {
    const pgn =
        "1. e4 e5 2. Nf3! [c2c3red] {Hello!} (2. d4? (2. c3) exd4 (2...d6))";

    beforeEach(() => {
        act(() => root.render(<PGNViewer {...{ pgn, start: startFen }} />));
    });

    test("Test Chessboard Params", () => {});
    test("Test Key Handlers", () => {});
});
