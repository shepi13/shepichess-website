import { GameState } from "@/components/PGNViewer/PGNViewer";
import { loadPgn } from "@/lib/loadPgn";


interface PGNButtonHandlers {
    start: () => void,
    end: () => void,
    next: () => void,
    prev: () => void,
    flip: () => void,
}

interface PGNViewerButtonProps {
    handlers: PGNButtonHandlers, 
    gameState: GameState, 
    pgn: string,
    start: string,
}

export default function PGNViewerButtons({handlers, gameState, pgn, start}: PGNViewerButtonProps) {
    const mainVariation = loadPgn(pgn, start);
    return (
        <div className="flex justify-between p-1 lg:p-5 pr-0">
            <div className="flex justify-between w-2/3">
                <button 
                    className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                    onClick={handlers.start} 
                    disabled={gameState.halfMoveNum <= 0}
                >
                    &lt;&lt;
                </button>
                <button 
                    className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                    onClick={handlers.prev} 
                    disabled={gameState.halfMoveNum <= 0 && gameState.variation.id === mainVariation.id}
                >
                    &nbsp;&lt;&nbsp;
                </button>
                <button 
                    className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                    onClick={handlers.next} 
                    disabled={gameState.halfMoveNum >= gameState.variation.moves.length}
                >
                    &nbsp;&gt;&nbsp;
                </button>
                <button 
                    className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                    onClick={handlers.end} 
                    disabled={gameState.halfMoveNum >= mainVariation.moves.length && gameState.variation.id === mainVariation.id}
                >
                    &gt;&gt;
                </button>
            </div>
            <button className="cursor-pointer text-large hover:text-secondary-dark" onClick={handlers.flip}>Flip Board</button>
        </div>
    );
}