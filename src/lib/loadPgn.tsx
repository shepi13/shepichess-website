import { Chess } from "chess.js";

export interface Variation {
    id: number;
    start: string,
    moves: Array<Move>
}
export interface Move {
    moveNumber: number,
    color: string,
    move: string,
    annotation: string,
    comment: string,
    variation: Variation | null,
    fullMatch: string,
    fenAfter: string,
}

export function getFen(variation: Variation, moveNumber: number) {
    if(moveNumber === 0) {
        return variation.start;
    }
    return variation.moves[moveNumber-1].fenAfter;
}

export function loadPgn(pgn: string, start: string, id: number = 0): Variation {
    // Use chessjs game just to verify pgn moves are legal, since it doesn't support variations or custom pgn starting positions
    const game = new Chess(start);

    const tokens = [...pgn.matchAll(/(?:[0-9]*\.+)* *((?:[A-Za-z]+[0-9]+)|0-0-0|0-0|O-O-O|O-O)([!?]+)* *(?:\{(.*?)\})? *(?:\(((?:[^()]*?)|(?:[^()]*?\([^()]*?\)[^()]*?))\))?/g)];
    const moves = [];
    let new_id = id*100;
    for(const token of tokens) {
        const moveNumber = game.moveNumber();
        const sideToMove = game.turn();
        const beforeFen = game.fen();

        game.move(token[1].replace(/0/g, "O"));
        moves.push({
            color: sideToMove,
            moveNumber: moveNumber,
            move: token[1],
            annotation: token[2],
            comment: token[3],
            variation: token[4] ? loadPgn(token[4], beforeFen, ++new_id) : null,
            fullMatch: token[0],
            fenAfter: game.fen()
        })
    }
  
    return {id: id, start: start, moves: moves};
}