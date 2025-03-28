"use client";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
// @ts-expect-error Type files not found for chess.js
import { Chess } from "chess.js";

const StartFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function PGNViewer({pgn, start=StartFen}: {pgn?: string, start?: string}) {
    const pgnChess = new Chess(start);
    const [game, setGame] = useState(new Chess(start));
    const [halfMovNum, setHalfMovNum] = useState(0);
    const [flipped, setFlipped] = useState(false);

    pgnChess.loadPgn(pgn);

    const firstMove = () => goToMove(0);
    const prevMove = () => goToMove(halfMovNum-1);
    const nextMove = () => goToMove(halfMovNum+1);
    const lastMove = () => goToMove(pgnChess.history().length)
    const  flipBoard = () => setFlipped(prev => !prev);
    
    function goToMove(moveNum: number) {
        if(moveNum < 0 || moveNum > pgnChess.history().length) {
            return;
        }

        const gameCopy = new Chess(start);
        for(let i = 0; i < moveNum; i++) {
            gameCopy.move(pgnChess.history()[i]);
        }
        setGame(gameCopy);
        setHalfMovNum(gameCopy.history().length);
    }
    
    function handleKeyDown({key}: {key: string}) {
        switch(key) {
            case "ArrowUp": firstMove(); break;
            case "ArrowDown": lastMove(); break;
            case "ArrowLeft": prevMove(); break;
            case "ArrowRight": nextMove(); break;
            case "f":
            case "F": flipBoard(); break;
        }
    }

    return (
        <div className="border-primaryblack-light dark:border-primarywhite-dark border-solid border-3" onKeyDown={handleKeyDown} tabIndex={1}>
            <div className="flex h-full w-full">
                <div className="w-2/3 h-full">
                    <Chessboard position={game.fen()} arePiecesDraggable={false} boardOrientation={flipped ? "black" : "white"}/>
                    <div className="flex justify-between p-5 pr-0">
                        <div className="flex justify-between w-2/3">
                            <button className="cursor-pointer text-xl" onClick={firstMove} disabled={halfMovNum <= 0}>&lt;&lt;</button>
                            <button className="cursor-pointer text-xl" onClick={prevMove} disabled={halfMovNum <= 0}>&lt;</button>
                            <button className="cursor-pointer text-xl" onClick={nextMove} disabled={halfMovNum >= pgnChess.history().length}>&gt;</button>
                            <button className="cursor-pointer text-xl" onClick={lastMove} disabled={halfMovNum >= pgnChess.history().length}>&gt;&gt;</button>
                        </div>
                        <button className="cursor-pointer text-large" onClick={flipBoard}>Flip Board</button>
                    </div>
                </div>
                <div className="w-1/3 h-full p-2 sm:p-5 text-xs sm:text-lg">{
                    pgnChess.history().map((move: string, i: number) => {
                        // Add number before move if it is a white move.
                        const move_text = i % 2 == 0 ? "" + (i/2+1) + "." + move + " " : move + " ";
                        return (
                            <span 
                                key={`movetext_${i}`} 
                                onClick={() => goToMove(i+1)}
                                className={`p-1 cursor-pointer ${i+1==halfMovNum && "font-bold dark:text-secondary text-primary ring-1 rounded-lg"}`}
                            >
                                {move_text}
                            </span>
                        );
                    })
                }</div>
            </div>
        </div>
    )
}