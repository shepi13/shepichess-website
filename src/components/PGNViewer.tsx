"use client";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { loadPgn, getFen, Variation, Move } from "@/lib/loadPgn";

const StartFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

interface GameState {
    variation: Variation,
    halfMoveNum: number,
}
type StateCallback = (state: GameState) => GameState;

const variationStylesByLevel = new Map([
    [0, "text-xs lg:text-xl"],
    [1, "text-2xs lg:text-lg"],
    [-1, "text-3xs lg:text-base"],
]);

export default function PGNViewer({pgn, start=StartFen, small=false}: {pgn: string, start?: string, small?: boolean}) {
    const mainVariation = loadPgn(pgn, start);
    const subVariation = mainVariation.moves[0].variation || mainVariation;

    // Current state of display board
    const [gameState, setGameState] = useState({variation: subVariation, halfMoveNum: 0});
    const [flipped, setFlipped] = useState(false);

    const currentFen = getFen(gameState.variation, gameState.halfMoveNum);

    // PGN Button Handlers
    const firstMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: 0}));
    const lastMove = () => setGameStateSafe(prev => ({...prev, variation: mainVariation, halfMoveNum: mainVariation.moves.length}));
    const nextMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum + 1}));
    const prevMove = () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum - 1}));
    const flipBoard = () => setFlipped(prev => !prev);

    // Update gamestate using react callback, forces invariants to make sure current position is within move tree
    function setGameStateSafe(callback: StateCallback) {
        setGameState(prevState => {
            const newState = callback(prevState);
            if (newState.halfMoveNum < 0 || newState.halfMoveNum > newState.variation.moves.length) {
                return prevState
            }
            return newState;
        });
    }

    function enterVariation() {
        setGameStateSafe(prevState => {
            const moveNum = prevState.halfMoveNum ? prevState.halfMoveNum - 1 : prevState.halfMoveNum;
            const newVariation = prevState.variation.moves[moveNum].variation
            if(newVariation) {
                return {...prevState, variation: newVariation, halfMoveNum: 1}
            }
            if(moveNum == 0) {
                return {...prevState, halfMoveNum: 1}
            }
            return prevState
        });
    }
    
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
                            className={`${move.annotation && move.annotation.startsWith("!") && "text-lime-700 dark:text-lime-400"}`} 
                            dangerouslySetInnerHTML={{__html: move_text}}>
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
                <div className="w-2/3 sm:w-1/2 h-full">
                    <Chessboard position={currentFen} arePiecesDraggable={false} boardOrientation={flipped ? "black" : "white"}/>
                    <div className="flex justify-between p-1 lg:p-5 pr-0">
                        <div className="flex justify-between w-2/3">
                            <button 
                                className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                                onClick={firstMove} 
                                disabled={gameState.halfMoveNum <= 0}
                            >
                                &lt;&lt;
                            </button>
                            <button 
                                className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                                onClick={prevMove} 
                                disabled={gameState.halfMoveNum <= 0 && gameState.variation === mainVariation}
                            >
                                &nbsp;&lt;&nbsp;
                            </button>
                            <button 
                                className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                                onClick={nextMove} 
                                disabled={gameState.halfMoveNum >= gameState.variation.moves.length}
                            >
                                &nbsp;&gt;&nbsp;
                            </button>
                            <button 
                                className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                                onClick={lastMove} 
                                disabled={gameState.halfMoveNum >= mainVariation.moves.length && gameState.variation === mainVariation}
                            >
                                &gt;&gt;
                            </button>
                        </div>
                        <button className="cursor-pointer text-large hover:text-secondary-dark" onClick={flipBoard}>Flip Board</button>
                    </div>
                </div>
                <div className="w-1/2 h-full p-2 lg:p-5">{displayVariation(mainVariation)}</div>
            </div>
        </div>
    )
}