"use client";

import { Chessboard } from "react-chessboard";

import { PGNViewerButtons } from "@/components/chess/PGNViewerButtons";
import { PGNViewerNotation } from "@/components/chess/PGNViewerNotation";

import { useEngineAnalysis } from "@/lib/hooks/useEngineAnalysis";
import { useToggle } from "@/lib/hooks/useToggle";
import { useVariation } from "@/lib/hooks/useVariation";
import { startFen } from "@/lib/types/pgnTypes";
import { sideToMove } from "@/lib/utils/chessUtils";
import { loadPgn } from "@/lib/utils/loadPgn";

import { ChessBoardIcon } from "../ChessBoardIcon";

const MaxDepth = 21;
const VariationDisplayLength = 5;

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

  // Engine State
  const [stockfishData, stockfishEnabled, setStockfishEnabled] =
    useEngineAnalysis(fen(), MaxDepth, VariationDisplayLength);
  const toggleEnabled = () => setStockfishEnabled(!stockfishEnabled);

  const currentMove =
    halfMoveNum != 0 ? variation.moves[halfMoveNum - 1] : null;
  const whiteToMove = sideToMove(fen()) == "w";

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
      className={`flex border-primaryblack-light dark:border-primarywhite-dark border-solid border-3 mb-5
        ${small && "md:w-4/5 xl:w-1/2"}`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
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
      <div className="w-1/2 p-2 pb-2 lg:p-5 lg:pb-2 flex flex-col justify-between items-end-safe">
        <div aria-label="Notation Viewer" className="w-full">
          {
            <PGNViewerNotation
              variation={mainVariation}
              gameState={{ variation, halfMoveNum }}
              setGameState={setGameState}
            />
          }
        </div>
        <div className="flex flex-col justify-end font-semibold gap-2 text-xs md:text-sm xl:text-base min-w-1/2 xl:pl-8">
          <div aria-label="stockfish-pv" hidden={!stockfishEnabled}>
            {stockfishData.pv}
          </div>
          <div
            className={
              "flex items-center gap-1 lg:gap-2 xl:gap-3 " +
              (stockfishEnabled ? "justify-between" : "justify-end")
            }
          >
            <p aria-label="stockfish-depth" hidden={!stockfishEnabled}>
              Depth: {stockfishData.depth}/{MaxDepth}
            </p>
            <p aria-label="stockfish-eval" hidden={!stockfishEnabled}>
              Eval: {(stockfishData.evaluation / 100) * (whiteToMove ? 1 : -1)}
            </p>
            <button
              className="mb-1 lg:border-1 xl:border-2 dark:border-slate-400 rounded-md p-[3px] cursor-pointer overflow-hidden hover:border-primary pointer-events-none"
              title="Toggle Analysis"
              aria-label="Stockfish toggle"
              onClick={toggleEnabled}
            >
              <ChessBoardIcon
                lightColor="slate200"
                darkColor="black"
                numSquares={4}
                className="border-1 lg:border-2 dark:border-1 w-4 xs:w-5 md:w-6 xl:w-7 overflow-hidden pointer-events-auto"
                hoverColor={"secondary"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
