import useEngine from "@/lib/hooks/useEngine";
import usePosition from "@/lib/hooks/usePosition";
import { Position, startFen } from "@/lib/pgnTypes";
import { Chess, Square } from "chess.js";
import PlayableChessBoardStateless from "./PlayableChessBoard";


export default function PlayAgainstComputer({start = startFen, playerColor = "", depth = 15}) {
    playerColor = playerColor || new Chess(start).turn();

    const position = usePosition(start, false);
    const engine = useEngine((message) => {
        console.log(message);
        const bestMove = message.match(/bestmove\s+(\S+)/)?.[1];
        if (bestMove) {
            position.makeMove(
                bestMove.substring(0, 2) as Square, 
                bestMove.substring(2, 4) as Square, 
                bestMove.substring(4, 5),
            );
        }
    });

    if(playerColor == "b") position.toggleFlipped();

    const makeMoveAndRespond = (from: Square, to: Square, promotion: string) => {
        const success = position.makeMove(from, to, promotion);
        if(success) {
            engine.evaluatePosition(position.game.fen(), depth);
        }
        return success
    }
    const undoHumanAndComputerMove = () => {
        position.undoMove();
        if(position.game.turn() != playerColor) position.undoMove();
    }
    const boardHandlers: Position = {
        ...position,
        makeMove: makeMoveAndRespond,
        undoMove: undoHumanAndComputerMove,
    }
    return <PlayableChessBoardStateless position={boardHandlers} />
}