"use client";

import { useSearchParams } from "next/navigation";

import { Chess, Square } from "chess.js";
import { Suspense, useCallback, useEffect } from "react";

import PlayableChessBoardStateless from "@/components/chess/PlayableChessBoard";

import { useEngine } from "@/lib/hooks/useEngine";
import { usePosition } from "@/lib/hooks/usePosition";
import { startFen } from "@/lib/types/pgnTypes";

export function PlayAgainstComputer({
  start = startFen,
  playerColor = "",
  depth = 15,
}) {
  playerColor = playerColor || new Chess(start).turn();

  const position = usePosition(start, playerColor.startsWith("b"));
  const engine = useEngine(({ bestMove }) => {
    if (bestMove) {
      position.makeMove(
        bestMove.substring(0, 2) as Square,
        bestMove.substring(2, 4) as Square,
        position.game.turn() + bestMove.substring(4, 5),
      );
    }
  });
  const turn = position.game.turn();
  const player = position.flipped ? "b" : "w";
  const fen = position.game.fen();
  const isGameOver = position.game.isGameOver();
  const makeEngineMove = useCallback(
    () => engine.evaluatePosition(fen, depth),
    [fen, depth, engine],
  );

  useEffect(() => {
    if (turn != player && !isGameOver) {
      makeEngineMove();
    }
  }, [turn, player, isGameOver, makeEngineMove]);

  const undoHumanAndComputerMove = () => {
    position.undoMove();
    if (turn == player) position.undoMove();
  };

  let result;
  if (isGameOver) {
    if (position.game.isDraw()) {
      result = <h3>Draw!</h3>;
    } else {
      result = <h3>{turn == "w" ? "Black Wins!" : "White Wins!"}</h3>;
    }
  } else {
    result = <h3>{turn == "w" ? "White to Move" : "Black to Move"}</h3>;
  }

  return (
    <>
      {result}
      <PlayableChessBoardStateless
        position={{ ...position, undoMove: undoHumanAndComputerMove }}
        flipText="Switch Sides"
      />
    </>
  );
}

export function PlayAgainstComputerParams({ depth = 15 }) {
  const InnerComponent = () => {
    const searchParams = useSearchParams();

    const initialPosition = searchParams.get("start") ?? startFen;
    const initialSide = searchParams.get("color") ?? "";
    return (
      <PlayAgainstComputer
        start={initialPosition}
        playerColor={initialSide}
        depth={depth}
      />
    );
  };

  return (
    <Suspense>
      <InnerComponent />
    </Suspense>
  );
}
