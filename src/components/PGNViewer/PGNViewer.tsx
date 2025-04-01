"use client";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { loadPgn, getFen} from "@/lib/loadPgn";
import { Variation, Move, startFen } from "@/lib/pgnTypes";
import PGNViewerButtons from "./PGNViewerButtons";

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
}
export type PGNStateCallback = (state: GameState) => GameState;

const variationStylesByLevel = new Map([
    [0, "text-xs lg:text-xl"],
    [1, "text-2xs lg:text-lg"],
    [-1, "text-3xs lg:text-base"],
]);

export default function PGNViewer(
    {pgn="", start=startFen, small=false, showNotation=true, draggable=false}: PGNViewerProps
) {
    const mainVariation = loadPgn(pgn, start);

    // Current state of display board
    const [gameState, setGameState] = useState({variation: mainVariation, halfMoveNum: 0});
    const [flipped, setFlipped] = useState(false);

    const currentFen = getFen(gameState.variation, gameState.halfMoveNum);
    const currentMove = gameState.halfMoveNum != 0 ? gameState.variation.moves[gameState.halfMoveNum-1] : null;

    // PGN Button Handlers
    const firstMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: 0}));
    const lastMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: mainVariation.moves.length}));
    const nextMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum + 1}));
    const prevMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum - 1}));
    const flipBoard = () => setFlipped(prev => !prev);

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

    //----------------------------------------------------------
    // Rendering Logic

    function displayVariation(variation: Variation, level: number = 0) {
        const variation_jsx = variation.moves.map((move: Move, i: number) => {
            const isCurrentMove = (variation.id === gameState.variation.id && i+1 === gameState.halfMoveNum);
            
            // Show move number
            let move_number = "";
            if (move.color == 'w') {
                move_number += move.moveNumber + ". ";
            }
            else if (i == 0) {
                move_number += move.moveNumber + "... ";
            }
            // Actual move and annotation
            let move_text = "";
            move_text += move.move;
            move_text += move.annotation || "";
            return (
                <div key={`${variation.start}_${i}`} className={`inline ${variationStylesByLevel.get(level) || variationStylesByLevel.get(-1)}`}>
                    <div 
                        className={
                            `p-1 cursor-pointer text-nowrap inline
                            ${level > 0 && "italic"}
                            ${isCurrentMove && "font-bold text-primaryblack dark:text-primarywhite bg-secondary dark:bg-secondary-light rounded-lg"}
                        `}
                        onClick={() => setGameStateSafe(prev => ({...prev, variation: variation, halfMoveNum: i+1}))}
                    >
                        {move_number}
                        <span 
                            className={`
                                ${move.annotation && move.annotation.startsWith("!") && "text-lime-600 dark:text-lime-400"}
                                ${move.annotation && move.annotation.startsWith("?") && "text-sky-900 dark:text-sky-200"}
                            `} 
                            dangerouslySetInnerHTML={{__html: move_text + "&nbsp;"}}>
                        </span>
                    </div>
                    <div className="inline">
                        {move.comment ? <span className="text-primary p-1"> {move.comment}</span> : <span> </span>}
                        {move.variation ? displayVariation(move.variation, level + 1) : ""}
                    </div>
                </div>
            );
        });

        // Wrap subvariations in parenthesis
        return (
            <div className="inline">
                {level > 0? <span>( </span> : ""}
                {variation_jsx}
                {level > 0? <span>)</span> : ""}
            </div>
        );
    }

    return (
        <div className={`border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5 ${small && "md:w-4/5 xl:w-2/5"}`} onKeyDown={handleKeyDown} tabIndex={1}>
            <div className="flex h-full w-full">
                <div className={`${showNotation ? "w-2/3 sm:w-1/2" : "w-full"} h-full`}>
                    <Chessboard 
                        position={currentFen} 
                        arePiecesDraggable={draggable} 
                        boardOrientation={flipped ? "black" : "white"} 
                        customArrows={currentMove ? currentMove.arrows : []}
                        customBoardStyle={{"boxShadow": "3px 3px 5px rgba(0,0,0,.8)"}}
                    />
                    <PGNViewerButtons 
                        handlers={{start: firstMove, end: lastMove, next: nextMove, prev: prevMove, flip: flipBoard}} 
                        gameState={gameState}
                        pgn={pgn}
                        start={start}
                    /> 
                </div>
                {showNotation && <div className="w-1/2 h-full p-2 lg:p-5">{displayVariation(mainVariation)}</div>}
            </div>
        </div>
    )
}