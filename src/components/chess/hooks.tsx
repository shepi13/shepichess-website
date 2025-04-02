import { Chess, Square } from "chess.js";
import { useMemo, useState } from "react";

export interface Position {
    position: string,
    flipped: boolean
    resetPosition: () => void,
    undoMove: () => void,
    makeMove: (arg0: Square, arg1: Square, arg2: string) => boolean,
    setPosition: (arg0: string) => void,
    toggleFlipped: () => void,
}

export function usePosition(initialPosition: string, initialOrientation: boolean) : Position {
    const game = useMemo(() => new Chess(initialPosition), [initialPosition]);
    const [position, setPosition] = useState(initialPosition);
    const [flipped, toggleFlipped] = useToggle(initialOrientation);

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
            game.move({from: start, to: end, promotion: piece[1].toLowerCase() ?? "q"});
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

    return {
        position: position,
        flipped: flipped,
        resetPosition: resetPosition, 
        undoMove: undoMove, 
        makeMove: makeMove,
        setPosition: publicSetPosition,
        toggleFlipped: toggleFlipped,
    }
}

export default function useToggle(initialVal: boolean) : [boolean, () => void] {
    const [flipped, setFlipped] = useState(initialVal)

    return [flipped, () => {setFlipped(prev => !prev)}];
}