"use client";

import { useEffect, useRef } from "react";

export interface StockfishResult {
    bestMove: string;
    ponder: string;
    evaluation: string;
    possibleMate: string;
    pv: string;
    depth: number;
}

export default function useEngine(callback: (arg0: StockfishResult) => void) {
    const workerRef = useRef<Worker>(null);

    function onMessage(event: MessageEvent) {
        const message = event.data;
        callback({
            bestMove: message.match(/bestmove\s+(\S+)/)?.[1],
            ponder: message.match(/ponder\s+(\S+)/)?.[1],
            evaluation: message.match(/cp\s+(\S+)/)?.[1],
            possibleMate: message.match(/mate\s+(\S+)/)?.[1],
            pv: message.match(/ pv\s+(.*)/)?.[1],
            depth: Number(message.match(/ depth\s+(\S+)/)?.[1]) || 0,
        });
    }

    useEffect(() => {
        workerRef.current = new window.Worker("/stockfish/stockfish.js");
        workerRef.current.onmessage = onMessage;
        workerRef.current.postMessage("uci");
        workerRef.current.postMessage("isready");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function evaluatePosition(fen: string, depth: number) {
        workerRef.current?.postMessage(`position fen ${fen}`);
        workerRef.current?.postMessage(`go depth ${depth}`);
    }
    function stop() {
        workerRef.current?.postMessage("stop"); // Run when changing positions
    }
    function quit() {
        workerRef.current?.postMessage("quit"); // Good to run this before unmounting.
        workerRef.current?.terminate();
    }

    return { evaluatePosition, stop, quit };
}
