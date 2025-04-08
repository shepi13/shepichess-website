import {
  GameState,
  Move,
  PGNStateCallback,
  Variation,
} from "@/lib/types/pgnTypes";
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
  gameState?: GameState;
  setGameState?: (arg0: PGNStateCallback) => void;
  level?: number;
}

const variationStylesByLevel = new Map([
  [0, "text-xs lg:text-xl"],
  [1, "text-2xs lg:text-lg"],
  [-1, "text-3xs lg:text-base"],
]);

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
}: PGNViewerNotationProps) {
  return (
    <>
      {level > 0 ? <span>( </span> : ""}
      {variation.moves.map((move: Move, i: number) => {
        const isCurrentMove =
          variation.id === gameState?.variation.id &&
          i + 1 === gameState.halfMoveNum;
        // Move Number only shows for either white player or on first move of variation
        let move_number = "";
        if (move.color == "w") {
          move_number = move.moveNumber + ". ";
        } else if (i == 0) {
          move_number = move.moveNumber + "... ";
        }

        const move_text = move.move + move.annotation;

        return (
          <div
            key={`${variation.start}_${i}`}
            className={`inline ${variationStylesByLevel.get(level) || variationStylesByLevel.get(-1)}`}
          >
            <div
              className={`p-1 cursor-pointer text-nowrap inline
                                ${level > 0 && "italic"}
                                ${isCurrentMove && "font-bold text-primaryblack dark:text-primarywhite bg-secondary dark:bg-secondary-light rounded-lg"}
                            `}
              onClick={
                setGameState &&
                (() =>
                  setGameState((prev) => ({
                    ...prev,
                    variation,
                    halfMoveNum: i + 1,
                  })))
              }
              data-testid={move_number + move_text}
            >
              {move_number}
              <span
                className={`
                                    ${moveIsGreat(move) && "text-lime-600 dark:text-lime-400"}
                                    ${moveIsMistake(move) && "text-sky-900 dark:text-sky-200"}
                                `}
                dangerouslySetInnerHTML={{
                  __html: move_text + "&nbsp;",
                }}
              ></span>
            </div>
            {move.comment ? (
              <span className="text-primary p-1 ml-[-3px]">
                {move.comment}{" "}
              </span>
            ) : (
              <span> </span>
            )}
            {move.variation && (
              <PGNViewerNotation
                variation={move.variation}
                gameState={gameState}
                setGameState={setGameState}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
      {level > 0 ? <span>)</span> : ""}
    </>
  );
}
