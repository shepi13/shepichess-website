// Mocks for testPlayComputer

import { startFen } from "@/lib/types/pgnTypes";
import { Chess } from "chess.js";

export const mockUseEngine = jest.fn((callback) => {
    const evaluatePosition = jest.fn((fen: string, depth: number) => {
        const game = new Chess(fen);
        const randomMove = () => {
            const move = game.moves({ verbose: true })[0];
            return move.from + move.to + (move.promotion ?? "");
        };

        const bestMove = randomMove();
        game.move(game.moves()[0]);
        const ponder = randomMove();
        callback({
            bestMove,
            ponder,
            evaluation: 100,
            possibleMate: "",
            pv: bestMove + " " + ponder,
            depth,
        });
    });
    const stop = jest.fn();
    const quit = jest.fn();
    return { evaluatePosition, stop, quit };
});

const searchParamsGet = jest.fn(
    (key: "fen" | "color") => ({ fen: startFen, color: "w" })[key],
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchParamsEmpty = jest.fn((_key) => null);

const useSearchParamsMock = jest.fn();
useSearchParamsMock
    .mockReturnValueOnce({ get: searchParamsGet })
    .mockReturnValue({ get: searchParamsEmpty });

jest.mock("@/lib/hooks/useEngine", () => {
    // Correct: returns a mock object
    return {
        __esModule: true,
        default: mockUseEngine,
    };
});
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useSearchParams: useSearchParamsMock,
}));
