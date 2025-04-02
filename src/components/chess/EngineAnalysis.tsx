"use client";

import { startFen } from "@/lib/pgnTypes";
import PGNViewerButtons from "./PGNViewerButtons";
import { Chessboard } from "react-chessboard";
import { usePosition, Position } from "@/components/chess/hooks";

const buttonStyles = "font-bold text-2xl ring-primary ring-3 p-1 mt-1 lg:mt-0 lg:p-3 rounded-md hover:text-primary-dark \
                 hover:shadow-[3px_3px_5px_rgba(0,0,0,.8)] hover:drop-shadow-[2px_2px_3px_rgba(0,0,0,.2)] \
                 dark:hover:shadow-[3px_3px_5px_rgba(255,255,255,.8)] dark:hover:drop-shadow-[2px_2px_3px_rgba(255,255,255,.2)]"



export function EngineAnalysis({start = startFen}) {
    /**
     * React component where the user can make legal moves
     */
    const position = usePosition(start, false);
    return <PlayableChessBoard position={position} />
}

function PlayableChessBoard({position}: {position: Position}) {
    return (
        <div>
            <div className="border-primaryblack-light dark:border-primarywhite-dark border-solid border-3">
                <Chessboard 
                    position={position.position} 
                    boardOrientation={position.flipped ? "black" : "white"}
                    onPieceDrop={position.makeMove}
                    animationDuration={0}
                    customArrowColor={"rgb(138, 12, 58)"}
                    customDropSquareStyle={{ boxShadow: 'inset 0 0 3px 3px rgb(138, 12, 58)'}}
                />
            </div>
            <PGNViewerButtons 
                flipButtonStyles={buttonStyles}
                moveButtonStyles={buttonStyles + " mr-5"}
                moveButtonContainerStyles="justify-left"
                moveButtons={[
                    {onClick: position.resetPosition, disabled: false, children: "Reset"},
                    {onClick: position.undoMove, disabled: false, children: "Undo"},
                ]} 
                onFlipBoard={position.toggleFlipped}
            />
        </div>
    )
}