// Mocks for testPlayComputer
import { Chess } from "chess.js";

import { Position, startFen } from "@/lib/types/pgnTypes";

export let currentFen = "";
export let evaluatedPosition = "";
const mockPlayableChessBoard = ({ position }: { position: Position }) => {
  currentFen = position.position;
  return (
    <div>
      {position.position}
      <button onClick={position.undoMove}>Undo</button>
      <button onClick={position.toggleFlipped}>Flip</button>;
    </div>
  );
};

const mockUseEngine = jest.fn((callback) => {
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
    evaluatedPosition = fen;
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

jest.mock("@/lib/hooks/useEngineWorker", () => {
  return {
    __esModule: true,
    useEngine: mockUseEngine,
  };
});
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: useSearchParamsMock,
}));
jest.mock("@/components/ChessBoard/PlayableChessBoard", () => ({
  ...jest.requireActual("@/components/ChessBoard/PlayableChessBoard"),
  __esModule: true,
  PlayableChessBoardStateless: mockPlayableChessBoard,
}));
