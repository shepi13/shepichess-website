import { Chess } from "chess.js";


export const mockUseEngine = jest.fn((callback) => {
    const evaluatePosition = jest.fn((fen: string, depth: number) => {
        const game = new Chess(fen);
        const randomMove = () => {
            const move = game.moves({verbose: true})[0];
            return move.from + move.to + (move.promotion ?? "")
        }

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
    return {evaluatePosition, stop, quit};
});

jest.mock('@/lib/hooks/useEngine', () => {
    // Correct: returns a mock object
    return {
        __esModule: true,
        default: mockUseEngine,
    }
});