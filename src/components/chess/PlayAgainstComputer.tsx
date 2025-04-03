"use client";

import useEngine from "@/lib/hooks/useEngine";
import usePosition from "@/lib/hooks/usePosition";
import { startFen } from "@/lib/types/pgnTypes";
import { Chess, Square } from "chess.js";
import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PlayableChessBoardStateless from "./PlayableChessBoard";


export function PlayAgainstComputer({start = startFen, playerColor = "", depth = 15}) {
    playerColor = playerColor || new Chess(start).turn();

    const position = usePosition(start, playerColor.startsWith("b"));
    const engine = useEngine(({bestMove}) => {
        if (bestMove) {
            position.makeMove(
                bestMove.substring(0, 2) as Square, 
                bestMove.substring(2, 4) as Square, 
                position.game.turn() + (bestMove.substring(4, 5) ?? "q"),
            );
        }
    });
    const turn = position.game.turn();
    const player = position.flipped ? "b" : "w";
    const fen = position.game.fen();
    const makeEngineMove = useCallback(() => engine.evaluatePosition(fen, depth), [fen, depth, engine]);

    useEffect(() => {
        if(turn != player) {
            makeEngineMove();
        }
    }, [turn, player, makeEngineMove])

    const undoHumanAndComputerMove = () => {
        position.undoMove();
        if(position.game.turn() != playerColor) position.undoMove();
    }

    let result = <h1></h1>;
    if(position.game.isGameOver()) {
        if(position.game.isDraw()) {
            result = <h3>Draw!</h3>
        }
        result = <h3>{position.game.turn() == "w" ? "Black Wins!" : "White Wins!"}</h3>
    }

    return (
    <>
        {result};
        <PlayableChessBoardStateless position={{...position, undoMove: undoHumanAndComputerMove}} flipText="Switch Sides" />;
    </>
    );
}
 
export function PlayAgainstComputerParams({depth=15}) {
    const searchParams = useSearchParams();

    const initialPosition = searchParams.get("start") ?? startFen;
    const initialSide = searchParams.get("color") ?? "";

    return <PlayAgainstComputer start={initialPosition} playerColor={initialSide} depth={depth}/>
}