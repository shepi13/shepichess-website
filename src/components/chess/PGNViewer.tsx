"use client";

import { Chessboard } from "react-chessboard";
import { loadPgn } from "@/lib/utils/loadPgn";
import { startFen } from "@/lib/types/pgnTypes";
import PGNViewerButtons from "./PGNViewerButtons";
import PGNViewerNotation from "./PGNViewerNotation";
import useToggle from "@/lib/hooks/useToggle";
import { useVariation } from "@/lib/hooks/useVariation";

export interface PGNViewerProps {
  pgn?: string;
  start?: string;
  small?: boolean;
  showNotation?: boolean;
  draggable?: boolean;
  flip?: boolean;
  onDrop?: () => void;
}

export default function PGNViewer({
  pgn = "",
  start = startFen,
  small = false,
}: PGNViewerProps) {
  /**
   * React Component that renders a chessboard, adding functionality for pgn parsing,
   * move tree traversal with buttons/key handlers, flipping the board, and displaying
   * notation in a prettified way that also links to specific board positions when clicked.
   *
   * It also supports displaying comments, arrows, and annotations stored in a simplified variation of pgn format
   *
   * @param pgn - the pgn describing the move tree (see lib/loadPgn for format)
   * @param start - the fen of the starting position (defaults to the standard chess setup)
   * @param small - if the display board should be small (TODO: rework into proper styling params before release)
   *
   */

  const mainVariation = loadPgn(pgn, start);

  // Current state of display board
  const [flipped, flipBoard] = useToggle(false);
  const {
    variation,
    halfMoveNum,
    fen,
    firstMove,
    lastMove,
    nextMove,
    prevMove,
    enterVariation,
    exitVariation,
    setGameState,
  } = useVariation(mainVariation);

  const currentMove =
    halfMoveNum != 0 ? variation.moves[halfMoveNum - 1] : null;

  // Handle arrow key functions to scroll through pgn
  function handleKeyDown(event: React.KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case "ArrowUp":
        firstMove();
        break;
      case "ArrowDown":
        lastMove();
        break;
      case "ArrowLeft":
        prevMove();
        break;
      case "ArrowRight":
        nextMove();
        break;
      case "f":
      case "F":
        flipBoard();
        break;
      case " ":
        enterVariation();
        break;
      case "Escape":
        exitVariation();
        break;
    }
  }

  return (
    <div
      className={`flex border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5
                ${small && "md:w-4/5 xl:w-2/5"}`}
      onKeyDown={handleKeyDown}
      tabIndex={1}
    >
      <div className="w-3/5 h-full">
        <Chessboard
          position={fen()}
          arePiecesDraggable={false}
          boardOrientation={flipped ? "black" : "white"}
          customArrows={currentMove ? currentMove.arrows : []}
          customBoardStyle={{
            boxShadow: "3px 3px 5px rgba(0,0,0,.8)",
          }}
        />
        <PGNViewerButtons
          leftButtons={[
            {
              onClick: firstMove,
              disabled: halfMoveNum <= 0 && variation.id === mainVariation.id,
              children: "<<",
            },
            {
              onClick: prevMove,
              disabled: halfMoveNum <= 0,
              children: "<",
            },
            {
              onClick: nextMove,
              disabled: halfMoveNum >= variation.moves.length,
              children: ">",
            },
            {
              onClick: lastMove,
              disabled:
                halfMoveNum >= mainVariation.moves.length &&
                variation.id === mainVariation.id,
              children: ">>",
            },
          ]}
          rightButtons={[{ onClick: flipBoard, children: "Flip Board" }]}
          leftContainerStyle="justify-left gap-2 xl:gap-4 pt-1 xl:pt-0"
        />
      </div>
      <div className="w-1/2 p-2 lg:p-5 flex flex-col justify-between">
        <div>
          {
            <PGNViewerNotation
              variation={mainVariation}
              gameState={{ variation, halfMoveNum }}
              setGameState={setGameState}
            />
          }
        </div>
        <div className="text-right">Engine Analysis!</div>
      </div>
    </div>
  );
}
