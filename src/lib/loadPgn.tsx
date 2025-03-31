import { Chess } from "chess.js";

import { Arrows, isSquare, Variation } from "@/lib/pgnTypes";

const annotationLookup = new Map([
    ["$1", "!"],
    ["$2", "?"],
    ["$3", "!!"],
    ["$4","??"],
    ["$5", "!?"],
    ["$6", "?!"],
    ["$7", "&square;"],
    ["$10", "="],
    ["$13", "&infin;"],
    ["$14", "&pluse;"],
    ["$15", "&eplus;"],
    ["$16", "&plusmn;"],
    ["$17", "&mnplus;"],
    ["$18", "&plus;&#45;",],
    ["$19", "&#45;&plus",],
    ["$22", "&xodot",],
    ["$23", "&xodot",],
    ["$36", "&uarr;",],
    ["$37", "&uarr;",],
    ["$40", "&rarr;",],
    ["$41", "&rarr;",],
    ["$132", "&lrarr;",],
    ["$133", "&lrarr;",],
]);

/*
/
    (?:[0-9]*\.+)?          #Optional move number (Number followed by . or ...)
     *
    ((?:[A-Za-z]+[0-9])     # Move (Letters followed by number, eg. Ng5)
    |0-0-0|0-0|O-O-O|O-O)   # or castling
     *
    ([/!?=+-]+|\$[0-9]+)*   # Annotation (!?=+- for direct annotation, e.g. $13 for pgn style notation) TODO: Should accept annotation for move and position
     *
    (?:\[(.*?)\])?          # Optional Arrows (Capture values inside [], will not be nested)
     *
    (?:\{(.*?)\})?          # Optional Comment (Capture values inside {}), comments cannot be nested
     *
    (?:\$\((.*?)\$\))?      # Optional Variations (Capture values inside $( to $), this will not be nested after preprocessing)
/g

Note that order must always be annotations -> arrows -> comments -> variations. This makes the most sense logistically, as variations
are directly tied to the move, arrows to the position, then comments to the current text, and variations to the next move.
*/
const pgnParseRegex = /(?:[0-9]*\.+)? *((?:[A-Za-z]+[0-9])|0-0-0|0-0|O-O-O|O-O) *([/!?=+-]+|\$[0-9]+)* *(?:\[(.*?)\])? *(?:\{(.*?)\})? *(?:\$\((.*?)\$\))?/g

export function getFen(variation: Variation, moveNumber: number) {
    if(moveNumber === 0) {
        return variation.start;
    }
    return variation.moves[moveNumber-1].fenAfter;
}

export function loadPgn(pgn: string, start: string, id: number = 0): Variation {
    pgn = preParsePgn(pgn);

    // Use chessjs game just to verify pgn moves are legal, since it doesn't support variations or custom pgn starting positions
    const game = new Chess(start);

    const tokens = [...pgn.matchAll(pgnParseRegex)];
    const moves = [];
    let new_id = id+1000;
    for(const token of tokens) {
        const moveNumber = game.moveNumber();
        const sideToMove = game.turn();
        const beforeFen = game.fen();

        game.move(token[1].replace(/0/g, "O"));
        moves.push({
            color: sideToMove,
            moveNumber: moveNumber,
            move: token[1],
            annotation: getAnnotation(token[2]),
            comment: token[4],
            variation: token[5] ? loadPgn(token[5], beforeFen, ++new_id) : null,
            arrows: parseArrows(token[3]),
            fullMatch: token[0],
            fenAfter: game.fen(),
        })
    }
  
    return {id: id, start: start, moves: moves};
}

function getAnnotation(annotationPgn: string) {
    return annotationLookup.get(annotationPgn) || annotationPgn;
}

function parseArrows(arrowPgn: string) {
    const arrows: Arrows = [];
    if(!arrowPgn) return arrows;

    for (const arrow of arrowPgn.split(" ")) {
        const start = arrow.substring(0,2);
        const end = arrow.substring(2,4)
        
        if(isSquare(start) && isSquare(end)) {
            arrows.push([start, end, arrow.substring(4)]);
        }
    }
    return arrows;
}

function preParsePgn(pgn: string): string {
    let level = 0;
    let inComment = false;
    let start = 0;
    const topLevelPairs = [];
    for(let i = 0; i < pgn.length; i++) {
        const char = pgn[i];
        if(inComment && char != '}') continue;
        
        switch(char) {
            case "{": inComment = true; continue;
            case "}": inComment = false; continue;
            case "(":
                if(level === 0) {start = i}
                level += 1;
                continue;
            case ")":
                if(level === 1) { topLevelPairs.push([start, i]); }
                level -= 1;
                continue;
        }
    }

    let result = "";
    let location = 0;
    for(const pair of topLevelPairs) {
        result += pgn.substring(location, pair[0]) + "$(" + pgn.substring(pair[0]+1, pair[1]) + "$)";
        location = pair[1] + 1;
    }
    result += pgn.substring(location);
    return result;
}