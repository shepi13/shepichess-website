"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Parsed move data from stockfish
 *
 * @property bestMove - The parsed best move
 * @property ponder - The response to ponder
 * @property evaluation - Evaluation in centipawns (from the perspective of the side to move)
 * @property possibleMate - possible mate stockfish sees
 * @property pv - Entire main variation suggested
 * @property depth - Actual depth searched
 */
export interface StockfishResult {
  bestMove: string;
  ponder: string;
  evaluation: number;
  possibleMate: string;
  pv: string;
  depth: number;
}

/**
 * React custom hook to manage a stockfish engine.
 *
 * Sets up engine in web worker in useEffect, tracking it with a react ref.
 * Can use a callback to respond to engine messages.
 *
 * Worker will be automatically cleaned up on component unmount.
 *
 * @param callback - Callback that will be passed a StockfishResult when the engine runs
 *
 * @returns {
 *  evaluatePosition(fen, depth),   // evaluates position given a fen string
 *  stop,                           // stops the current evaluation
 * }
 *
 */
export function useEngine(
  callback: (arg0: StockfishResult) => void,
  enabled: boolean,
) {
  const workerRef = useRef<Worker>(null);

  // Functions for interacting with Worker
  const evaluatePosition = useCallback((fen: string, depth: number) => {
    workerRef.current?.postMessage(`position fen ${fen}`);
    workerRef.current?.postMessage(`go depth ${depth}`);
  }, []);
  const stop = useCallback(() => {
    workerRef.current?.postMessage("stop");
  }, []);
  const quit = useCallback(() => {
    workerRef.current?.postMessage("quit");
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  // OnMessage handler for engine, using useCallback because it is a dependency for future hooks
  const messageHandler = useCallback(
    (event: MessageEvent) => {
      const message = event.data;
      callback({
        bestMove: message.match(/bestmove\s+(\S+)/)?.[1],
        ponder: message.match(/ponder\s+(\S+)/)?.[1],
        evaluation: message.match(/cp\s+(\S+)/)?.[1],
        possibleMate: message.match(/mate\s+(\S+)/)?.[1],
        pv: message.match(/ pv\s+(.*)/)?.[1],
        depth: Number(message.match(/ depth\s+(\S+)/)?.[1]) || 0,
      });
    },
    [callback],
  );

  // Setup worker only after initial mount, and use a quit cleanup function.
  useEffect(() => {
    if (enabled) {
      workerRef.current = new window.Worker("/stockfish/src/stockfish-nnue-16-single.js");
      workerRef.current.onmessage = messageHandler;
      workerRef.current.postMessage("uci");
      workerRef.current.postMessage("isready");
      return quit;
    }
  }, [quit, enabled, messageHandler]);

  return { evaluatePosition, stop };
}
