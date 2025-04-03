import { Chess, Square } from "chess.js";
import { useMemo, useState } from "react";
import { Position } from "../types/pgnTypes";


export default function usePosition(initialPosition: string, initialOrientation: boolean = false) : Position {
    const game = useMemo(() => new Chess(initialPosition), [initialPosition]);

    const [position, setPosition] = useState(initialPosition);
    const [flipped, setFlipped] = useState(initialOrientation);

    const resetPosition = () => {
        game.load(initialPosition);
        setPosition(game.fen());
    }
    const undoMove = () => {
        game.undo(); 
        setPosition(game.fen());
    };
    const makeMove = (start: Square, end: Square, piece: string) => {
        try {        
            game.move({from: start, to: end, promotion: piece[1]?.toLowerCase() ?? "q"});
        } catch(error) {
            console.log(error);
            return false;
        }
        setPosition(game.fen());
        return true;
    }
    const publicSetPosition = (newPosition: string) => {
        game.load(newPosition);
        setPosition(game.fen());
    }
    const toggleFlipped = () => {
        setFlipped(prev => !prev);
    }

    return {
        game: game,
        position: position,
        flipped: flipped,
        player: initialOrientation ? "b" : "w",
        resetPosition: resetPosition, 
        undoMove: undoMove, 
        makeMove: makeMove,
        setPosition: publicSetPosition,
        toggleFlipped: toggleFlipped,
    }
}