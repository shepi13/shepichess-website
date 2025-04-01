"use client";

import { startFen } from "@/lib/pgnTypes";
import PGNViewerButtons from "./PGNViewerButtons";
import { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

export function EngineAnalysis({start = startFen}) {
    const game = useMemo(() => new Chess(start), [start]);

    const [flipped, setFlipped] = useState(false);
    const [position, setPosition] = useState(start);

    const resetPosition = () => {
        game.load(start);
        setPosition(game.fen());
    }
    const undoMove = () => {
        game.undo(); 
        setPosition(game.fen());
    };
    const handlePieceDrop = (start: Square, end: Square, piece: string) => {
        try {        
            game.move({from: start, to: end, promotion: piece[1].toLowerCase() ?? "q"});
        } catch(error) {
            console.log(error);
            return false;
        }
        setPosition(game.fen());
        return true;
    }

    return (
        <div>
            <div className="border-primaryblack-light dark:border-primarywhite-dark border-solid border-3">
                <Chessboard 
                    position={position} 
                    boardOrientation={flipped ? "black" : "white"}
                    onPieceDrop={handlePieceDrop}
                    animationDuration={0}
                />
            </div>
            <PGNViewerButtons 
                flipButtonStyles="font-bold text-2xl ring-primary ring-3 p-1 mt-1 lg:mt-0 lg:p-3 rounded-md hover:bg-secondary hover:text-primary-dark"
                moveButtonStyles="font-bold text-2xl ring-primary ring-3 p-1 mt-1 lg:mt-0 lg:p-3 rounded-md hover:bg-secondary hover:text-primary-dark mr-5"
                moveButtonContainerStyles="justify-left"
                moveButtons={[
                    {onClick: resetPosition, disabled: false, children: "Reset"},
                    {onClick: undoMove, disabled: false, children: "Undo"},
                ]} 
                onFlipBoard={() => setFlipped((prev) => !prev)}
            />
        </div>
    )
}