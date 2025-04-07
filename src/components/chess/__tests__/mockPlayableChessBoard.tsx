export let currentFen = "";
export let orientation = "";

const mockReactChessBoard = ({
    position,
    boardOrientation,
}: {
    position: string;
    boardOrientation: string;
}) => {
    currentFen = position;
    orientation = boardOrientation;
    return <div>{position}</div>;
};

jest.mock("react-chessboard", () => ({
    ...jest.requireActual("react-chessboard"),
    __esModule: true,
    Chessboard: mockReactChessBoard,
}));
