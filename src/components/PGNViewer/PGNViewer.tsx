"use client";

import { Chessboard } from "react-chessboard";

import { PGNViewerButtons } from "@/components/PGNViewer/PGNViewerButtons";
import { PGNViewerNotation } from "@/components/PGNViewer/PGNViewerNotation";

import { useEngineAnalysis } from "@/lib/hooks/useEngineAnalysis";
import { useToggle } from "@/lib/hooks/useToggle";
import { useVariation } from "@/lib/hooks/useVariation";
import { moveSoundPath } from "@/lib/types/types";
import { makeVariationsNested, sideToMove } from "@/lib/utils/chessUtils";
import { loadPgn } from "@/lib/utils/loadPgn";

import { ChessBoardIcon } from "../ChessBoardIcon";

const MaxDepth = 21;
const VariationDisplayLength = 5;

/**
 * Properties accepted by PGNViewer Component
 *
 * @property pgn - PGN to display
 * @default "" - No moves parsed, only the initial position
 *
 * @property start - start position to parse the PGN from
 * @default startFen - initial chess position
 *
 * @property flipped - whether or not the board should be flipped
 */
export interface PGNViewerProps {
  pgn?: string;
  start?: string;
  puzzle?: boolean;
  flipped?: boolean;
}

/**
 * React Component that renders a chessboard, adding functionality for pgn parsing,
 * move tree traversal with buttons/key handlers, flipping the board, and displaying
 * notation in a prettified way that also links to specific board positions when clicked.
 *
 * It also supports displaying comments, arrows, and annotations stored in a simplified variation of pgn format
 *
 * @param pgn - the pgn describing the move tree (see lib/loadPgn for format)
 * @param start - the fen of the starting position (defaults to the standard chess setup)
 * @param flipped - whether the board should initially be flipped (user can toggle this)
 *
 */
export function PGNViewer({
  pgn = "",
  start,
  flipped = false,
}: PGNViewerProps) {
  const { gameTree: mainVariation } = loadPgn(pgn, start);

  // Current state of display board
  const [flipState, flipBoard] = useToggle(flipped);
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
  } = useVariation(makeVariationsNested(mainVariation), moveSoundPath);

  // Engine State
  const [stockfishData, stockfishEnabled, setStockfishEnabled] =
    useEngineAnalysis(fen(), MaxDepth, VariationDisplayLength);
  const toggleEnabled = () => setStockfishEnabled(!stockfishEnabled);

  const currentMove =
    halfMoveNum != 0 ? variation.moves[halfMoveNum - 1] : null;
  const whiteToMove = sideToMove(fen()) == "w";
  const arrows = currentMove ? [...currentMove.arrows] : [];

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
      className="flex border-primaryblack-light dark:border-primarywhite-dark border-solid border-3"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      aria-label="PGN Viewer"
    >
      <div className="w-3/5 h-full">
        <div aria-hidden="true">
          <Chessboard
            position={fen()}
            arePiecesDraggable={false}
            boardOrientation={flipState ? "black" : "white"}
            customArrows={arrows}
            customBoardStyle={{
              boxShadow: "3px 3px 5px rgba(0,0,0,.8)",
            }}
          />
        </div>
        <PGNViewerButtons
          leftButtons={[
            { onClick: firstMove, children: "<<" },
            { onClick: prevMove, children: "<" },
            { onClick: nextMove, children: ">" },
            { onClick: lastMove, children: ">>" },
          ]}
          rightButtons={[{ onClick: flipBoard, children: "Flip Board" }]}
          leftContainerStyle="justify-left items-center gap-2 xl:gap-4 pt-1 xl:pt-0"
        />
      </div>
      <div className="w-1/2 p-1 pt-2 pl-2 lg:p-2 lg:pl-4 lg:pt-4 flex flex-col justify-between items-end-safe">
        <div aria-label="Notation Viewer" className="w-full mb-2 h-3/5">
          {
            <PGNViewerNotation
              variation={mainVariation}
              gameState={{ variation, halfMoveNum }}
              setGameState={setGameState}
            />
          }
        </div>
        <div className="flex flex-col justify-end font-semibold gap-1 min-w-1/2 px-3 xl:px-6">
          <div
            aria-label="stockfish-pv"
            hidden={!stockfishEnabled}
            className="text-xs md:text-sm xl:text-base"
          >
            {stockfishData.pv}
          </div>
          <div
            className={
              "flex items-center gap-1 lg:gap-2 xl:gap-3 text-xs lg:text-sm " +
              (stockfishEnabled ? "justify-between" : "justify-end")
            }
          >
            <p aria-label="stockfish-depth" hidden={!stockfishEnabled}>
              Depth: {stockfishData.depth}/{MaxDepth}
            </p>
            <p aria-label="stockfish-eval" hidden={!stockfishEnabled}>
              Eval: {(stockfishData.evaluation / 100) * (whiteToMove ? 1 : -1)}
            </p>
            <p aria-label="stockfish-title" hidden={stockfishEnabled}>
              Stockfish 16
            </p>
            <button
              className="w-6 lg:w-7 xl:w-8 mb-1 cursor-pointer pointer-events-none border-1 lg:border-2 rounded-md overflow-hidden border-stone-700 dark:border-stone-300"
              title="Toggle Analysis"
              aria-label="Stockfish toggle"
              onClick={toggleEnabled}
            >
              <ChessBoardIcon
                lightColor="lightBrown"
                darkColor="black"
                numSquares={4}
                className=" pointer-events-auto hover:shadow-md dark:hover:border-secondary"
                hoverColor="darkBrown"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
