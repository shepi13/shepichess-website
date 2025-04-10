"use client";

import { Chessboard } from "react-chessboard";

import { PGNViewerButtons } from "@/components/chess/PGNViewerButtons";
import { PGNViewerNotation } from "@/components/chess/PGNViewerNotation";

import { useToggle } from "@/lib/hooks/useToggle";
import { useVariation } from "@/lib/hooks/useVariation";
import { startFen } from "@/lib/types/pgnTypes";
import { loadPgn } from "@/lib/utils/loadPgn";

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
    let handled = true;
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
      default:
        handled = false;
    }
    if (handled) event.preventDefault();
  }

  return (
    <div
      className="flex border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5"
      onKeyDown={handleKeyDown}
      aria-label="PGN Viewer"
    >
      <div className="w-3/5 h-full">
        <div aria-hidden="true">
          <Chessboard
            position={fen()}
            arePiecesDraggable={false}
            boardOrientation={flipped ? "black" : "white"}
            customArrows={currentMove ? currentMove.arrows : []}
            customBoardStyle={{
              boxShadow: "3px 3px 5px rgba(0,0,0,.8)",
            }}
          />
        </div>
        <PGNViewerButtons
          leftButtons={[
            {
              onClick: firstMove,
              disabled: false,
              children: "<<",
            },
            {
              onClick: prevMove,
              disabled: false,
              children: "<",
            },
            {
              onClick: nextMove,
              disabled: false,
              children: ">",
            },
            {
              onClick: lastMove,
              disabled: false,
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
