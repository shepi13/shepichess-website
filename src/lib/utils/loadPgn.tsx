import { Chess, Square } from "chess.js";

import { Arrows, Move, Variation } from "@/lib/types/pgnTypes";

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

// PGN REGEXES
// Creates Regex for matching content within start/end tags (for example between [], (), or {})
const genBoundaryRegex = (
  start: string,
  end: string,
  matchName: string,
  flags: string = "",
) =>
  new RegExp("(?:" + start + "(?<" + matchName + ">.*?)" + end + ")?", flags);

//Optional move number (Number followed by . or ...)
const moveNumberRegex = /(?:[0-9]*\.+)?/;

//Move (Letters followed by number, eg. Ng5), or castling
const moveRegex = /((?:[A-Za-z]+[0-9])|0-0-0|0-0|O-O-O|O-O)/;

//Optional Annotations (!?=+- for direct annotation, e.g. $13 for pgn style notation)
const annotationRegex = /((?:[/!?=+-]+ *|\$[0-9]+ *)*)?/;

// Arrows (in []), Comments (in {}), and Variations (in $(...$))
// Order must always be arrows -> comments -> variations
const arrrowRegex = genBoundaryRegex("\\[", "\\]", "arrows");
const commentRegex = genBoundaryRegex("\\{", "\\}", "comment");

// Support multiple variations -> $(var1$) $(var2$)
const variationRegex = genBoundaryRegex("\\$\\(", "\\$\\)", "variation", "g");
const multipleVariationsRegex = /(?<variations>(\$\(.*?\$\)\s*)*)/;

// Parse Move number, move, annotation, arrows, comments, and variations
// e.g. 2. Nf3! $13 [f3e5red] {Attacks e5} $(2. Bc4?$) $(2. Bd3??$)
const pgnParseRegex = new RegExp(
  [
    moveNumberRegex.source,
    moveRegex.source,
    annotationRegex.source,
    arrrowRegex.source,
    commentRegex.source,
    multipleVariationsRegex.source,
  ].join(/\s*/.source),
  "g",
);

/**
 *  Parses a PGN into variation objects (see pgnTypes.tsx)
 *  Each move should be in the form of 2. Nf3! [arrows] {comments} (variations)
 *
 *  @param pgn - pgn to parse
 *  @param start - fen for starting position
 *  @returns - Parsed Variation object
 */
export function loadPgn(
  pgn: string,
  start: string,
  id: number = 0,
  parentVar: Variation | null = null,
  parentMove: number = 0,
): Variation {
  // Replaces every outermost group of matching parenthesis with $( $), so we can easily match in regex
  pgn = markPgnVariations(pgn);

  // Use chessjs game just to verify pgn moves are legal, since it doesn't support variations or custom pgn starting positions
  const game = new Chess(start);

  const tokens = [...pgn.matchAll(pgnParseRegex)];
  const moves: Array<Move> = [];
  const currentVariation = {
    id,
    start,
    moves,
    parentMove,
    parentVariation: parentVar,
  };
  // Use 10000 id numbers for variations on current level, so next level starts 10000 higher
  let newId = id + 10000;

  tokens.forEach((token, index) => {
    const moveNumber = game.moveNumber();
    const sideToMove = game.turn();
    const beforeFen = game.fen();

    //Verify move is legal (replace 0-0 with O-O so either casltling notation works)
    game.move(token[1].replace(/0/g, "O"));

    // Handle variations
    const variations = [];
    if (token.groups && token.groups.variations) {
      // Reparse multiple variation string into each single variation
      const variationTokens = token.groups.variations.matchAll(variationRegex);
      for (const variationToken of variationTokens) {
        const varPgn = variationToken.groups?.variation ?? null;

        // Recursively add variation to the tree
        if (varPgn) {
          variations.push(
            loadPgn(varPgn, beforeFen, ++newId, currentVariation, index + 1),
          );
        }
      }
    }

    // Add parsed move to movelist, recursively calling loadPgn for nested variations
    moves.push({
      color: sideToMove,
      moveNumber,
      variations,
      move: token[1],
      annotation: getAnnotation(token[2]),
      comment: token.groups?.comment ?? "",
      arrows: parseArrows(token.groups?.arrows),
      fullMatch: token[0],
      fenAfter: game.fen(),
    });
  });

  return currentVariation;
}

//Replaces PGN Numeric codes with display html, removing extra whitespace
function getAnnotation(annotationPgn?: string) {
  if (!annotationPgn) return "";
  annotationPgn = annotationPgn.replaceAll(/\s*\$/g, " $");
  for (const [key, val] of annotationLookup) {
    annotationPgn = annotationPgn.replaceAll(key, val);
  }
  return annotationPgn.trim();
}

/* Parses arrows of form "a2a4orange, b2b4red" into squares and colors
 *  that can be used with react-chessboard.
 *
 *  These should be stored inside square brackets in the pgn (e.g. [f8c5blue, f8e7red])
 */
function parseArrows(arrowPgn?: string) {
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

/**
 * Replaces outermost matching parenthesis with $(... $), for easier regex parsing
 * Ignores any parenthesis inside pgn comments, represented by {...}
 *
 * @param pgn - the pgn to preprocess
 */
function markPgnVariations(pgn: string): string {
  let level = 0;
  let inComment = false;
  let start = 0;
  const topLevelPairs = [];
  for (let i = 0; i < pgn.length; i++) {
    const char = pgn[i];

    // Ignore all characters inside PGN Comments ({...})
    if (inComment && char != "}") continue;

    switch (char) {
      case "{":
        inComment = true;
        continue;
      case "}":
        inComment = false;
        continue;
      // Track nested parenthesis level, saving locations if we find a top level match
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

  // Rebuild string with all top level matches replaced
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
