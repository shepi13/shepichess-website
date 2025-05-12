"use client";

import { useSearchParams } from "next/navigation";

import { Chess, Square } from "chess.js";
import { Suspense, useCallback, useEffect } from "react";
import { toast } from "sonner";

import { PlayableChessBoardStateless } from "@/components/ChessBoard/PlayableChessBoard";

import { useAudio } from "@/lib/hooks/useAudio";
import { useEngine } from "@/lib/hooks/useEngineWorker";
import { usePosition } from "@/lib/hooks/usePosition";
import { startFen } from "@/lib/types/pgnTypes";
import { gameOverSoundPath, moveSoundPath } from "@/lib/types/types";

import { FenInput } from "./FenInput";

export type PlayComputerProps = {
  start?: string;
  side?: string;
  depth?: number;
  onFenInput?: (arg0: string) => void;
};

/**
 * Component that renders a chessboard and buttons to play chess against stockfish
 *
 * @param start - Fen for initial position,
 * @param playerColor - Initial color
 * @param depth - Depth for stockfish to use
 * @param onFenInput - custom handler to override FenInputHandler
 *
 * @returns Chessboard where the user can play against a computer
 */
export function PlayComputer({
  start = startFen,
  side = "",
  depth = 15,
  onFenInput,
}: PlayComputerProps) {
  side = side || new Chess(start).turn();

  // React hooks for position/engine state
  const position = usePosition(start, side.startsWith("b"), moveSoundPath);
  const engineCallback = useCallback(
    ({ bestMove }: { bestMove: string }) => {
      if (bestMove) {
        position.makeMove(
          bestMove.substring(0, 2) as Square,
          bestMove.substring(2, 4) as Square,
          position.game.turn() + bestMove.substring(4, 5),
        );
      }
    },
    [position],
  );
  const engine = useEngine(engineCallback, true);

  // Make engine move effect
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

  // Game Over Sound Effect
  const gameOverSound = useAudio(gameOverSoundPath);
  useEffect(() => {
    if (!position.game.isGameOver()) return;
    if (gameOverSound && gameOverSound.paused) {
      gameOverSound.play();
    }
    const win_string = position.game.isDraw()
      ? "Draw!"
      : position.game.turn() == "w"
        ? "Black Wins!"
        : "White Wins!";
    toast("Game Over", {
      action: { label: "Play Again!", onClick: position.resetPosition },
      description: win_string,
    });
  }, [gameOverSound, position]);

  // Input Handlers
  const handleUndo = () => {
    position.undoMove();
    if (turn == player) position.undoMove();
  };
  const handleSubmit = (fen: string) => {
    position.setPosition(fen);
    onFenInput?.(fen);
  };

  return (
    <div className="flex flex-col gap-4">
      <PlayableChessBoardStateless
        position={{ ...position, undoMove: handleUndo }}
        flipText="Switch Sides"
      />
      <FenInput fen={position.position} onSubmit={handleSubmit} />
    </div>
  );
}

/**
 * Wrapper for PlayComputer that defaults the initial position based on search parameters
 *
 * Also extends the fenInputHandler to set search params for better browser navigation.
 */
export function PlayComputerPage({ depth = 15 }) {
  const Page = () => {
    const searchParams = useSearchParams();

    const initialPosition = searchParams.get("fen") ?? startFen;
    const initialSide = searchParams.get("color") ?? "";

    const handleFenInput = (fen: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("fen", fen);
      window.history.pushState(null, "", `?${params.toString()}`);
    };

    return (
      <PlayComputer
        start={initialPosition}
        side={initialSide}
        depth={depth}
        onFenInput={handleFenInput}
      />
    );
  };

  return (
    <Suspense fallback={<PlayComputer />}>
      <Page />
    </Suspense>
  );
}
