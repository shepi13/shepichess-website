"use client";

import { Chessboard } from "react-chessboard";

import { PGNViewerButtons } from "@/components/chess/PGNViewerButtons";

import { usePosition } from "@/lib/hooks/usePosition";
import { Position } from "@/lib/types/pgnTypes";
import { moveSoundPath } from "@/lib/types/types";

const buttonStyles =
  "font-bold text-large ring-1 p-1 rounded-md hover:text-primary-dark \
                 hover:shadow-[3px_3px_5px_rgba(0,0,0,.8)] hover:drop-shadow-[2px_2px_3px_rgba(0,0,0,.2)] \
                 dark:hover:shadow-[3px_3px_5px_rgba(255,255,255,.8)] dark:hover:drop-shadow-[2px_2px_3px_rgba(255,255,255,.2)]";

/**
 * Playable chess board component with no state management.
 * For use by components that manage state using usePosition.
 *
 * @param props
 * @param props.position - Position object returned by usePosition, allows the parent to manage this state
 * @param props.flipText - Text for flip board button, default to "Flip Board!"
 */
export function PlayableChessBoardStateless({
  position,
  flipText = "Flip Board!",
}: {
  position: Position;
  flipText?: string;
}) {
  return (
    <>
      <div className="border-primaryblack-light dark:border-primarywhite-dark border-solid border-3">
        <Chessboard
          position={position.position}
          boardOrientation={position.flipped ? "black" : "white"}
          onPieceDrop={position.makeMove}
          animationDuration={0}
          customArrowColor={"rgb(138, 12, 58)"}
          customDropSquareStyle={{
            boxShadow: "inset 0 0 3px 3px rgb(138, 12, 58)",
          }}
        />
      </div>
      <PGNViewerButtons
        leftButtonStyle={buttonStyles}
        rightButtonStyle={buttonStyles.replace("text-large", "text-xl")}
        leftContainerStyle="justify-left gap-5"
        leftButtons={[
          {
            onClick: position.resetPosition,
            disabled: false,
            children: "Reset",
          },
          {
            onClick: position.undoMove,
            disabled: false,
            children: "Undo",
          },
        ]}
        rightButtons={[{ onClick: position.toggleFlipped, children: flipText }]}
      />
    </>
  );
}

/**
 * Simple display board, manages it's own state.
 * Allows the user to make moves, undo moves, or reset the board to the initial position
 *
 * @param props
 * @param props.start - Initial board position
 * @param props.flipped - Whether the board should be flipped to black's perspective
 */
export function PlayableChessBoard({
  start,
  flipped = false,
}: {
  start: string;
  flipped?: boolean;
}) {
  const position = usePosition(start, flipped, moveSoundPath);
  return <PlayableChessBoardStateless position={position} />;
}
