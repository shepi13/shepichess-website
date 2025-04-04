import { useState } from "react";
import { Variation, VariationState } from "../types/pgnTypes";
import { getFen } from "../utils/loadPgn";
import { PGNStateCallback } from "../types/pgnTypes";

export default function useVariation(variation: Variation): VariationState {
    const [gameState, setGameState] = useState({variation: variation, halfMoveNum: 0});

    function setGameStateSafe(callback: PGNStateCallback)
    {
        setGameState(prevState => {
            const newState = callback(prevState);
            if(!newState.variation || newState.halfMoveNum < 0 || newState.halfMoveNum > newState.variation.moves.length) {
                return prevState;
            }
            return newState;
        });
    }

    function enterVariation() {
        setGameStateSafe(prevState => {
            const variationMoves = prevState.variation.moves;
            const initialMoveNum = prevState.halfMoveNum;
            /* Find next variation if exists */
            for(let moveNum = Math.max(initialMoveNum - 1, 0); moveNum < variationMoves.length; moveNum++) {
                const variation = variationMoves[moveNum].variation;
                if(variation) {
                    return {...prevState, variation: variation, halfMoveNum: 1};
                }
            }
            return prevState;
        });
    }

    function exitVariation()
    {
        setGameStateSafe(prev => {
            return {
                variation: prev.variation.parentVariation || variation, 
                halfMoveNum: prev.variation.parentMove
            };
        });
    } 

    return {
        fen: () => getFen(gameState.variation, gameState.halfMoveNum),
        firstMove: () => setGameStateSafe(prev => ({...prev, variation: variation, halfMoveNum: 0})),
        lastMove: () => setGameStateSafe(prev => ({...prev, variation: variation, halfMoveNum: variation.moves.length})),
        nextMove: () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum + 1})),
        prevMove: () => setGameStateSafe(prev => ({...prev, halfMoveNum: prev.halfMoveNum - 1})),
        enterVariation: enterVariation,
        exitVariation: exitVariation,
        setGameState: setGameStateSafe,
        variation: gameState.variation,
        halfMoveNum: gameState.halfMoveNum,
    }
}