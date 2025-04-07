"use client";

import { useCallback, useEffect, useRef } from "react";

export interface StockfishResult {
  bestMove: string;
  ponder: string;
  evaluation: string;
  possibleMate: string;
  pv: string;
  depth: number;
}

export default function useEngine(callback: (arg0: StockfishResult) => void) {
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
  const workerRef = useRef<Worker>(null);

  // Functions for interacting with Worker
  function evaluatePosition(fen: string, depth: number) {
    workerRef.current?.postMessage(`position fen ${fen}`);
    workerRef.current?.postMessage(`go depth ${depth}`);
  }
  function stop() {
    workerRef.current?.postMessage("stop");
  }
  function quit() {
    workerRef.current?.postMessage("quit");
    workerRef.current?.terminate();
  }

  // OnMessage handler for engine, using useCallback because it is a dependency for future hooks
  const onMessage = useCallback(
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
    workerRef.current = new window.Worker("/stockfish/stockfish.js");
    workerRef.current.onmessage = onMessage;
    workerRef.current.postMessage("uci");
    workerRef.current.postMessage("isready");

    // Return cleanup function
    return quit;
  }, [onMessage]);

  return { evaluatePosition, stop, quit };
}
