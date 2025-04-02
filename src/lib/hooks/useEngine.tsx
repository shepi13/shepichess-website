"use client";

import { useEffect, useRef } from "react";

export default function useEngine(callback: (arg0: string) => void) {
    const workerRef = useRef<Worker>(null);

    useEffect(() => {
        workerRef.current = new Worker("/stockfish/stockfish.js")
        workerRef.current.onmessage = (event) => {
            callback(event.data);
        }
        workerRef.current.postMessage("uci");
        workerRef.current.postMessage("isready");
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function evaluatePosition(fen: string, depth: number) {
        workerRef.current?.postMessage(`position fen ${fen}`);
        workerRef.current?.postMessage(`go depth ${depth}`);
    }
    function stop() {
        workerRef.current?.postMessage("stop"); // Run when changing positions
    }
    function quit() {
        workerRef.current?.postMessage("quit"); // Good to run this before unmounting.
    }
    
    return {evaluatePosition: evaluatePosition, stop: stop, quit: quit}
}