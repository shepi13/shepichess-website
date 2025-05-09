import { Fragment, useEffect } from "react";

import { GameState, PGNStateCallback, Variation } from "@/lib/types/pgnTypes";
import { moveIsGreat, moveIsMistake } from "@/lib/utils/chessUtils";

/**
 * Properties passed to PGNViewerNotation. Describes variation to display and current
 * move for highlighting.
 *
 * @property variation - Variation tree to display
 * @property gameState - Current location of variation tree (used for highlighting)
 * @property setGameState - Setter for variation location (used to set position when user clicks on a move)
 * @property level - Used internally to style subvariations differently than the main one.
 */
export interface PGNViewerNotationProps {
  variation: Variation;
  gameState: GameState;
  setGameState?: (arg0: PGNStateCallback) => void;
  level?: number;
  puzzle?: string;
  id?: string;
}

// Styles
const variationStylesByLevel = new Map([
  [0, "text-xs lg:text-lg xl:text-xl"],
  [1, "text-xs lg:text-base xl:text-lg"],
  [-1, "text-xs lg:text-sm xl:text-base"],
]);
const currentMoveStyle =
  "text-black dark:text-white bg-secondary dark:bg-secondary-light rounded-lg shadow-md";

/**
 * Component that displays a variation tree, with styling
 *
 * Highlights great moves/blunders, and supports comments and nested variations (using
 * recursion), as well as PGN annotations.
 *
 * @param props - Current variation and GameState
 *
 * @returns HTML/JSX for pgn notation component.
 */
export function PGNViewerNotation({
  variation,
  gameState,
  setGameState,
  level = 0,
  puzzle = "",
  id = ""
}: PGNViewerNotationProps) {
  // Loop through every move and build a JSX for the entire notation tree.
  const notationJSXElems = [];
  for (const [i, move] of variation.moves.entries()) {
    if (puzzle && gameState?.halfMoveNum === 0 && level === 0) {
      notationJSXElems.push(
        <span
          key={`Puzzle Comment ${i}`}
          className="text-primary px-1 ml-[-3px] whitespace-pre-wrap"
          aria-label={"Puzzle: " + puzzle}
        >
          {puzzle}
        </span>,
      );
      break;
    }
    const isCurrentMove =
      variation.id === gameState?.variation.id &&
      i + 1 === gameState.halfMoveNum;
    const separator = move.annotation.includes("&") ? "&nbsp;" : "";
    const move_text = move.move + move.annotation;

    // Click to jump to move
    const clickHandler =
      setGameState &&
      (() =>
        setGameState((prev) => ({
          ...prev,
          variation,
          halfMoveNum: i + 1,
        })));

    // Move Number only shows for either white player or on first move of variation
    let move_number = "";
    if (move.color == "w") {
      move_number = move.moveNumber + ". ";
    } else if (i == 0) {
      move_number = move.moveNumber + "... ";
    }

    notationJSXElems.push(
      <Fragment key={`${variation.start}_${i}`}>
        {/* Move */}
        <button
          className={
            "px-1 py-0 sm:py-[1px] xl:py-[3px] cursor-pointer text-nowrap inline outline-none " +
            `${level > 0 && "italic"} ` +
            `${(isCurrentMove && currentMoveStyle + ` currentMove${id}`) || "border-transparent text-primaryblack-light dark:text-primarywhite"} `
          }
          onClick={clickHandler}
          aria-label={"Move: " + move_number + move_text}
        >
          {move_number}
          <span
            className={
              `${moveIsGreat(move) && "text-lime-600 dark:text-lime-400"} ` +
              `${moveIsMistake(move) && "text-sky-900 dark:text-sky-200"} `
            }
            dangerouslySetInnerHTML={{ __html: move_text + separator }}
          ></span>
        </button>

        {/* PGN Comment for move */}
        {move.comment && (
          <span
            className="text-primary px-1 ml-[-3px] whitespace-pre-wrap"
            aria-label={"Comment: " + move.comment}
          >
            {" " + move.comment}
          </span>
        )}

        {/* Variations for move */}
        {move.variations.length > 0 ? <> (</> : ""}
        {move.variations.map((variation, i) => (
          <Fragment key={variation.id}>
            <PGNViewerNotation
              {...{ variation, gameState, setGameState, level: level + 1 }}
            />
            {i < move.variations.length - 1 ? <>, </> : ""}
          </Fragment>
        ))}
        {move.variations.length > 0 ? <>) </> : ""}
      </Fragment>,
    );

    if (puzzle && level === 0 && isCurrentMove) {
      break;
    }
  }

  useEffect(() => {
    const elems = document.getElementsByClassName(`currentMove${id}`);
    for(let i = 0; i < elems.length; i++) {
      const elem = elems[i] as HTMLButtonElement
      const parentElem = document.getElementById(`notationScrollContainer${id}`);
      if(elem && parentElem) {
       parentElem.scrollTop = elem.offsetTop - parentElem.offsetTop - 50;
      }
    }
  }, [variation, gameState, id]);

  return (
    <div
      className={`inline ${variationStylesByLevel.get(level) || variationStylesByLevel.get(-1)}`}
    >
      {notationJSXElems}
    </div>
  );
}
