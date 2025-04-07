import { Chess, Square } from "chess.js";

import { Arrows, Variation, Move } from "@/lib/types/pgnTypes";

// Lookup table for PGN numerical annotations (see https://en.wikipedia.org/wiki/Portable_Game_Notation#Standard_NAGs)
const annotationLookup = [
  ["$132", "&lrarr;"],
  ["$133", "&lrarr;"],
  ["$10", "="],
  ["$13", "&infin;"],
  ["$14", "&pluse;"],
  ["$15", "&eplus;"],
  ["$16", "&plusmn;"],
  ["$17", "&mnplus;"],
  ["$18", "&plus;&#45;"],
  ["$19", "&#45;&plus"],
  ["$22", "&xodot"],
  ["$23", "&xodot"],
  ["$36", "&uarr;"],
  ["$37", "&uarr;"],
  ["$40", "&rarr;"],
  ["$41", "&rarr;"],
  ["$1", "!"],
  ["$2", "?"],
  ["$3", "!!"],
  ["$4", "??"],
  ["$5", "!?"],
  ["$6", "?!"],
  ["$7", "&square;"],
] as const;

/*
/
    (?:[0-9]*\.+)?                  #Optional move number (Number followed by . or ...)
     *
    ((?:[A-Za-z]+[0-9])             # Move (Letters followed by number, eg. Ng5)
    |0-0-0|0-0|O-O-O|O-O)           # or castling
     *
    ((?:[/!?=+-]+ *|\$[0-9]+ *)*)?  # Optional Annotations (!?=+- for direct annotation, e.g. $13 for pgn style notation)
     *
    (?:\[(.*?)\])?                  # Optional Arrows (Capture values inside [], will not be nested)
     *
    (?:\{(.*?)\})?                  # Optional Comment (Capture values inside {}), comments cannot be nested
     *
    (?:\$\((.*?)\$\))?              # Optional Variations (Capture values inside $( to $), this will not be nested after preprocessing)
/g

Note that order must always be annotations -> arrows -> comments -> variations. This makes the most sense logistically, as variations
are directly tied to the move, arrows to the position, then comments to the current text, and variations to the next move.
*/
const pgnParseRegex =
  /(?:[0-9]*\.+)? *((?:[A-Za-z]+[0-9])|0-0-0|0-0|O-O-O|O-O) *((?:[/!?=+-]+ *|\$[0-9]+ *)*)? *(?:\[(.*?)\])? *(?:\{(.*?)\})? *(?:\$\((.*?)\$\))?/g;

// Lookup position string for current variation/move
export function getFen(variation: Variation, moveNumber: number) {
  /**
   * Returns the fen for a variation after a specific move number (1 indexed)
   *
   * @param variation - variation to search
   * @param moveNumber - half move count (relative to variation start)
   */
  if (moveNumber === 0) {
    return variation.start;
  }
  return variation.moves[moveNumber - 1].fenAfter;
}

export function loadPgn(
  pgn: string,
  start: string,
  id: number = 0,
  parentVar: Variation | null = null,
  parentMove: number = 0,
): Variation {
  /**
   *  Parses a PGN into variation objects (see pgnTypes.tsx)
   *  Each move should be in the form of 2. Nf3! [arrows] {comments} (variations)
   *  See pgnParseRegex above for a more detailed parsing explanation
   *
   *  @param pgn - pgn to parse
   *  @param start - fen for starting position
   *  @returns - Parsed Variation object
   */

  // Replaces every outermost group of matching parenthesis with $( $), so we can easily match in regex
  pgn = preParsePgn(pgn);

  // Use chessjs game just to verify pgn moves are legal, since it doesn't support variations or custom pgn starting positions
  const game = new Chess(start);

  const tokens = [...pgn.matchAll(pgnParseRegex)];
  const moves: Array<Move> = [];
  const currentVariation = {
    id: id,
    start: start,
    moves: moves,
    parentVariation: parentVar,
    parentMove: parentMove,
  };
  // Save 10000 id numbers for variations on current level
  let newId = id + 10000;

  tokens.forEach((token, index) => {
    const moveNumber = game.moveNumber();
    const sideToMove = game.turn();
    const beforeFen = game.fen();

    game.move(token[1].replace(/0/g, "O"));
    moves.push({
      color: sideToMove,
      moveNumber: moveNumber,
      move: token[1],
      annotation: getAnnotation(token[2]),
      comment: token[4] || "",
      variation: token[5]
        ? loadPgn(token[5], beforeFen, ++newId, currentVariation, index + 1)
        : null,
      arrows: parseArrows(token[3]),
      fullMatch: token[0],
      fenAfter: game.fen(),
    });
  });

  return currentVariation;
}

function getAnnotation(annotationPgn?: string) {
  /**
   * Replaces PGN Numeric codes with display html, removing extra whitespace
   * @param annotationPgn - The matched annotation from our pgn regex
   */
  if (!annotationPgn) return "";
  annotationPgn = annotationPgn.replaceAll(/\s*\$/g, " $");
  for (const [key, val] of annotationLookup) {
    annotationPgn = annotationPgn.replaceAll(key, val);
  }
  return annotationPgn.trim();
}

function parseArrows(arrowPgn: string) {
  /**
   * Parses arrows of form "a2a4orange, b2b4red" into squares and colors
   * that can be used with react-chessboard.
   *
   * These should be stored inside square brackets in the pgn (e.g. [f8c5blue, f8e7red])
   *
   * @param arrowPgn - The parsed arrows from the pgn regex
   * @ returns arrows - An Array<Square, Square, string> representing the arrow and corresponding colors
   */
  const arrows: Arrows = [];
  if (!arrowPgn) return arrows;

  for (const arrow of arrowPgn.split(" ")) {
    if (!arrow) continue;
    const start = arrow.substring(0, 2);
    const end = arrow.substring(2, 4);
    arrows.push([start as Square, end as Square, arrow.substring(4)]);
  }
  return arrows;
}

function preParsePgn(pgn: string): string {
  /**
   * Replaces outermost matching parenthesis with $(... $), for easier regex parsing
   * Ignores any parenthesis inside pgn comments, represented by {...}
   *
   * @param pgn - the pgn to preprocess
   */
  let level = 0;
  let inComment = false;
  let start = 0;
  const topLevelPairs = [];
  for (let i = 0; i < pgn.length; i++) {
    const char = pgn[i];
    if (inComment && char != "}") continue;

    switch (char) {
      case "{":
        inComment = true;
        continue;
      case "}":
        inComment = false;
        continue;
      case "(":
        if (level === 0) {
          start = i;
        }
        level += 1;
        continue;
      case ")":
        if (level === 1) {
          topLevelPairs.push([start, i]);
        }
        level -= 1;
        continue;
    }
  }

  let result = "";
  let location = 0;
  for (const pair of topLevelPairs) {
    result +=
      pgn.substring(location, pair[0]) +
      "$(" +
      pgn.substring(pair[0] + 1, pair[1]) +
      "$)";
    location = pair[1] + 1;
  }
  result += pgn.substring(location);
  return result;
}
