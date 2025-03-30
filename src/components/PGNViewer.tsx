"use client";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import loadPgn from "@/lib/loadPgn";

const StartFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

interface Dictionary<T> {
    [Key: number]: T;
}

export default function PGNViewer({pgn, start=StartFen, small=false}: {pgn: string, start?: string, small?: boolean}) {
    // Current state of display board
    const [game, setGame] = useState(new Chess(start));
    const [halfMovNum, setHalfMovNum] = useState(0);
    const [flipped, setFlipped] = useState(false);
    // Used to track PGN to allow dynamic moves
    const pgnChess = loadPgn(pgn, start);
    const pgnComments = parsePgnComments(pgnChess);
    //Used for display purposes (text move nums, etc)
    const startBoard = new Chess(start);
    const initialMoveNum = startBoard.moveNumber();
    const initialTurn = startBoard.turn() === "w" ? 0 : 1;

    // PGN Button Handlers
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

    // Create map of {move_num: comment}
    // Can refactor this into lib/loadPgn as a simpler function now that tokenizing works
    function parsePgnComments(pgnChess: Chess) {
        const results: Dictionary<string> = {}
        const comments = pgnChess.getComments();
        const history = pgnChess.history();
        const gameCopy = new Chess(start);

        for(let halfmove = 0; halfmove <= history.length; halfmove++) {
            results[halfmove] = "";
            for(let i = 0; i < comments.length; i++) {
                if(comments[i].fen === gameCopy.fen()) {
                    results[halfmove] = " " + comments[i].comment + " ";
                }
            }
            if(halfmove == history.length) break;
            gameCopy.move(history[halfmove]);
        }
        return results;
    }
    
    // Handle arrow key functions to scroll through pgn
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
        <div className={`border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5 ${small && "md:w-4/5 xl:w-2/5"}`} onKeyDown={handleKeyDown} tabIndex={1}>
            <div className="flex h-full w-full">
                <div className="w-2/3 sm:w-1/2 h-full">
                    <Chessboard position={game.fen()} arePiecesDraggable={false} boardOrientation={flipped ? "black" : "white"}/>
                    <div className="flex justify-between p-1 lg:p-5 pr-0">
                        <div className="flex justify-between w-2/3">
                            <button className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" onClick={firstMove} disabled={halfMovNum <= 0}>&lt;&lt;</button>
                            <button className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" onClick={prevMove} disabled={halfMovNum <= 0}>&nbsp;&lt;&nbsp;</button>
                            <button className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" onClick={nextMove} disabled={halfMovNum >= pgnChess.history().length}>&nbsp;&gt;&nbsp;</button>
                            <button className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" onClick={lastMove} disabled={halfMovNum >= pgnChess.history().length}>&gt;&gt;</button>
                        </div>
                        <button className="cursor-pointer text-large hover:text-secondary-dark" onClick={flipBoard}>Flip Board</button>
                    </div>
                </div>
                <div className="w-1/2 h-full p-2 lg:p-5 text-xs lg:text-lg">{
                    pgnChess.history().map((move: string, i: number) => {
                        const move_comment = pgnComments[i+1];
                        // Add number before move if it is a white move.
                        const move_text = i % 2 == initialTurn ? "" + Math.ceil(i/2 + initialMoveNum) + "." + move : move;
                        return (
                            <div key={`movetext_${i}`} className="inline">
                                <span
                                    onClick={() => goToMove(i+1)}
                                    className={`p-1 cursor-pointer text-nowrap ${i+1==halfMovNum && "font-bold dark:text-primarywhite text-secondarywhite ring-secondary ring-1 rounded-lg"}`}
                                >
                                    {i == 0 && initialTurn == 1 ? "" + initialMoveNum + "... " : ""}{move_text} 
                                </span>
                                {move_comment ? <span className="lg:text-xl text-primary p-1"> {move_comment}</span> : <span> </span>}
                            </div>
                        );
                    })
                }</div>
            </div>
        </div>
    )
}