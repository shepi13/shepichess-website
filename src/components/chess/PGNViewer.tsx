"use client";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { loadPgn, getFen} from "@/lib/loadPgn";
import { Variation, startFen } from "@/lib/pgnTypes";
import PGNViewerButtons from "./PGNViewerButtons";
import PGNViewerNotation from "./PGNViewerNotation";
import useToggle from "@/lib/hooks/useToggle";

export interface GameState {
    variation: Variation,
    halfMoveNum: number,
}
export interface PGNViewerProps {
    pgn?: string, 
    start?: string, 
    small?: boolean, 
    showNotation?: boolean, 
    draggable?: boolean,
    flip?: boolean,
    onDrop?: () => void,
}
export type PGNStateCallback = (state: GameState) => GameState;

export default function PGNViewer({
    pgn="", 
    start=startFen, 
    small=false
}: PGNViewerProps) {
    /**
     * React Component that renders a chessboard, adding functionality for pgn parsing,
     * move tree traversal with buttons/key handlers, flipping the board, and displaying
     * notation in a prettified way that also links to specific board positions when clicked.
     * 
     * It also supports displaying comments, arrows, and annotations stored in a simplified variation of pgn format
     * 
     * @param pgn - the pgn describing the move tree (see lib/loadPgn for format)
     * @param start - the fen of the starting position (defaults to the standard chess setup)
     * @param small - if the display board should be small (TODO: rework into proper styling params before release)
     * 
     */

    const mainVariation = loadPgn(pgn, start);

    // Current state of display board
    const [gameState, setGameState] = useState({variation: mainVariation, halfMoveNum: 0});
    const [flipped, flipBoard] = useToggle(false);

    const currentFen = getFen(gameState.variation, gameState.halfMoveNum);
    const currentMove = gameState.halfMoveNum != 0 ? gameState.variation.moves[gameState.halfMoveNum-1] : null;

    // PGN Button Handlers
    const firstMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: 0}));
    const lastMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: mainVariation.moves.length}));
    const nextMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum + 1}));
    const prevMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum - 1}));

    // Update gamestate using react callback, forces invariants to make sure current position is within move tree
    const setGameStateSafe = (callback: PGNStateCallback) => setGameState(prevState => {
        const newState = callback(prevState);
        if(!newState.variation || newState.halfMoveNum < 0 || newState.halfMoveNum > newState.variation.moves.length) {
            return prevState;
        }
        return newState;
    });

    const enterVariation = () => setGameStateSafe(prevState => {
        const variationMoves = prevState.variation.moves;
        const initialMoveNum = prevState.halfMoveNum;
        /* Find next variation if exists */
        for(let moveNum = Math.max(initialMoveNum - 1, 0); moveNum < variationMoves.length; moveNum++) {
            const variation = variationMoves[moveNum].variation;
            if(variation) {
                return {...prevState, variation: variation, halfMoveNum: 1};
            }
        }
        return initialMoveNum == 0 ? {...prevState, halfMoveNum: 1} : prevState;
    });

    const exitVariation = () => setGameStateSafe(prev => {
        return {
            variation: prev.variation.parentVariation || mainVariation, 
            halfMoveNum: prev.variation.parentMove
        };
    }); 
    
    // Handle arrow key functions to scroll through pgn
    function handleKeyDown(event: React.KeyboardEvent) {
        event.preventDefault();
        switch(event.key) {
            case "ArrowUp": firstMove(); break;
            case "ArrowDown": lastMove(); break;
            case "ArrowLeft": prevMove(); break;
            case "ArrowRight": nextMove(); break;
            case "f":
            case "F": flipBoard(); break;
            case " ": enterVariation(); break;
            case "Escape": exitVariation(); break;
        }
    }

    return (
        <div className=
            {
                `border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5
                ${small && "md:w-4/5 xl:w-2/5"}`
            }
            onKeyDown={handleKeyDown} 
            tabIndex={1}
        >
            <div className="flex h-full w-full">
                <div className="w-2/3 sm:w-1/2 h-full">
                    <Chessboard 
                        position={currentFen} 
                        arePiecesDraggable={false} 
                        boardOrientation={flipped  ? "black" : "white"} 
                        customArrows={currentMove ? currentMove.arrows : []}
                        customBoardStyle={{"boxShadow": "3px 3px 5px rgba(0,0,0,.8)"}}
                    />
                    <PGNViewerButtons 
                        moveButtons={[
                            {
                                onClick: firstMove, 
                                disabled: gameState.halfMoveNum <= 0 && gameState.variation.id === mainVariation.id,
                                children: "<<",
                            },
                            {onClick: prevMove, disabled: gameState.halfMoveNum <= 0, children: "<"},
                            {onClick: nextMove, disabled: gameState.halfMoveNum >= gameState.variation.moves.length, children: ">"},
                            {
                                onClick: lastMove, 
                                disabled: gameState.halfMoveNum >= mainVariation.moves.length && gameState.variation.id === mainVariation.id,
                                children: ">>",
                            }
                        ]}
                        onFlipBoard={flipBoard}
                    />
                </div>
                <div className="w-1/2 h-full p-2 lg:p-5">{
                    <PGNViewerNotation variation={mainVariation} gameState={gameState} setGameState={setGameStateSafe} />}
                </div>
            </div>
        </div>
    )
}